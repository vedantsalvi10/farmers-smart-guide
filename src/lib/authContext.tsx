import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  lastUpdated?: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  firebaseInitialized: boolean;
}

// Create a named context with a default value that matches the shape
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  firebaseInitialized: false
});

// Export the hook as a named function declaration
export function useAuth() {
  return useContext(AuthContext);
}

// Set up local persistence for better user experience
try {
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Auth persistence set to local"))
    .catch(error => {
      console.warn("Error setting auth persistence:", error);
    });
} catch (error) {
  console.warn("Failed to set auth persistence:", error);
}

// For local development (uncomment for testing with emulator)
// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize Firebase auth
  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      // Check if Firebase is initialized
      if (!auth) {
        console.error("Firebase Auth is not initialized");
        setAuthError("Firebase Auth is not initialized");
        setLoading(false);
        return;
      }

      setFirebaseInitialized(true);

      unsubscribe = onAuthStateChanged(auth, 
        async (user) => {
          setCurrentUser(user);
          
          if (user) {
            try {
              const docRef = doc(db, "users", user.uid);
              const docSnap = await getDoc(docRef);
              
              if (docSnap.exists()) {
                setUserData(docSnap.data() as UserData);
              } else {
                // Create basic user data if it doesn't exist
                const basicUserData = {
                  uid: user.uid,
                  email: user.email || "",
                  lastUpdated: serverTimestamp()
                };
                await setDoc(docRef, basicUserData);
                setUserData(basicUserData);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          } else {
            setUserData(null);
          }
          
          setLoading(false);
        }, 
        (error) => {
          console.error("Auth state change error:", error);
          setAuthError(error.message);
          setLoading(false);
        }
      );
    } catch (error: any) {
      console.error("Firebase initialization error:", error);
      setAuthError(error.message);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Display auth initialization errors
  useEffect(() => {
    if (authError) {
      toast({
        title: "Authentication Error",
        description: authError,
        variant: "destructive"
      });
    }
  }, [authError, toast]);

  // Helper function to handle auth errors
  const handleAuthError = (error: any, operation: string): never => {
    console.error(`${operation} error:`, error);
    
    const message = getAuthErrorMessage(error);
    
    toast({
      title: `${operation} Failed`,
      description: message,
      variant: "destructive"
    });
    
    throw error;
  };

  // Get user-friendly error messages
  const getAuthErrorMessage = (error: any): string => {
    // Default message
    let message = error.message || "An unknown error occurred";
    
    // Handle specific Firebase error codes
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "This email is already in use";
          break;
        case 'auth/invalid-email':
          message = "Invalid email address";
          break;
        case 'auth/weak-password':
          message = "Password is too weak";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message = "Invalid email or password";
          break;
        case 'auth/too-many-requests':
          message = "Too many attempts. Please try again later";
          break;
        case 'auth/network-request-failed':
          message = "Network error. Please check your connection";
          break;
        case 'auth/configuration-not-found':
          message = "Authentication service is misconfigured. Please contact support";
          break;
        case 'auth/operation-not-allowed':
          message = "This authentication method is not enabled";
          break;
        case 'auth/user-disabled':
          message = "This account has been disabled";
          break;
        default:
          // Keep the original message for unknown error codes
          break;
      }
    }
    
    return message;
  };

  const login = async (email: string, password: string) => {
    if (!firebaseInitialized) {
      const error = new Error("Firebase Auth is not initialized");
      toast({
        title: "Service Unavailable",
        description: "Authentication service is not initialized. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      return handleAuthError(error, "Login");
    }
  };

  const register = async (email: string, password: string) => {
    if (!firebaseInitialized) {
      const error = new Error("Firebase Auth is not initialized");
      toast({
        title: "Service Unavailable",
        description: "Authentication service is not initialized. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error: any) {
      return handleAuthError(error, "Registration");
    }
  };

  const logout = async () => {
    if (!firebaseInitialized) {
      const error = new Error("Firebase Auth is not initialized");
      toast({
        title: "Service Unavailable",
        description: "Authentication service is not initialized. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }

    try {
      await firebaseSignOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      return handleAuthError(error, "Logout");
    }
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!currentUser || !firebaseInitialized) {
      const error = new Error("No user is logged in or service is not available");
      toast({
        title: "Update failed",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      throw error;
    }
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      
      await updateDoc(userRef, {
        ...data,
        lastUpdated: serverTimestamp()
      });
      
      // Update local state
      setUserData(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      return handleAuthError(error, "Profile update");
    }
  };

  // Use useMemo to memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    userData,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    firebaseInitialized
  }), [currentUser, userData, loading, firebaseInitialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 