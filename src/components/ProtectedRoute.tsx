import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // If the user is not authenticated and not loading, show a toast
    if (!loading && !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
  }, [currentUser, loading, toast]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to home page with a state parameter to remember where the user was trying to go
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 