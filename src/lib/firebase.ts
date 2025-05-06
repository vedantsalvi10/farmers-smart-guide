import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwI-3B4LBrnsJDHEVJhkGWNxQs3wFbxIs",
  authDomain: "agricare-973f9.firebaseapp.com",
  projectId: "agricare-973f9",
  storageBucket: "agricare-973f9.firebasestorage.app",
  messagingSenderId: "251106785603",
  appId: "1:251106785603:web:15c13b2473afb20059d7f6",
  measurementId: "G-TE7YFP1837"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log(`Firebase initialized with project: ${firebaseConfig.projectId}`);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    app = getApps()[0];
  }
} else {
  app = getApps()[0];
}

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with explicit settings and long polling
const firestoreSettings = {
  cacheSizeBytes: 40000000, // 40 MB
  experimentalForceLongPolling: true, // Enable long polling to fix connectivity issues
};

const db = initializeFirestore(app, firestoreSettings);

// Initialize Analytics conditionally
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    isSupported()
      .then(supported => {
        if (supported) {
          analytics = getAnalytics(app);
          console.log("Analytics initialized");
        }
      })
      .catch(error => {
        console.warn("Analytics not supported:", error);
      });
  } catch (error) {
    console.error("Error initializing analytics:", error);
  }
}

export { app, auth, db, analytics }; 