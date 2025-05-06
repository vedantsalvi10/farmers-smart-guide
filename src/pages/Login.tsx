import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfiguration, setShowConfiguration] = useState(false);
  const { login, currentUser, firebaseInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect them
  useEffect(() => {
    if (currentUser) {
      // If coming from a protected route (via state), go back there
      const from = location.state?.from || "/";
      navigate(from);
    }
  }, [currentUser, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowConfiguration(false);

    if (!firebaseInitialized) {
      setError("Firebase authentication is not initialized properly");
      setShowConfiguration(true);
      return;
    }
    
    setIsLoading(true);

    try {
      await login(email, password);
      // Don't navigate here - the useEffect will handle it
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Check for specific configuration-not-found error
      if (err.code === 'auth/configuration-not-found') {
        setError("Authentication service is not configured properly. If this persists, please contact support.");
        setShowConfiguration(true);
      } else {
        setError(err.message || "Failed to log in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-agri-neutral-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-agri-blue-dark">Farmer's Smart Guide</CardTitle>
          <CardDescription className="text-center">Enter your credentials to log in</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {showConfiguration && (
            <Alert className="mb-4">
              <AlertDescription className="text-xs">
                <p>Firebase configuration details:</p>
                <ul className="list-disc pl-4 mt-1">
                  <li>Project ID: agricare-973f9</li>
                  <li>Auth Domain: agricare-973f9.firebaseapp.com</li>
                </ul>
                <p className="mt-1">Please ensure you have Email/Password authentication enabled in your Firebase console.</p>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-agri-blue-dark hover:underline">
              Register
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link to="/" className="text-agri-neutral-600 hover:underline">
              Return to home page
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 