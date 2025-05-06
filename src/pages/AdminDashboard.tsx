import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: any;
  lastUpdated?: any;
}

const AdminDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // For a real app, you would implement proper admin checks with custom claims
  // This is a simple check based on email for demonstration
  const isAdmin = currentUser?.email === "admin@example.com";
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) {
        setError("Access denied: You don't have admin privileges");
        setLoading(false);
        return;
      }
      
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersList: User[] = [];
        
        snapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() } as User);
        });
        
        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAdmin, currentUser]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-agri-blue-dark">Admin Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.displayName || "—"}</TableCell>
                    <TableCell>{user.phoneNumber || "—"}</TableCell>
                    <TableCell>{user.address || "—"}</TableCell>
                    <TableCell>
                      {user.createdAt 
                        ? new Date(user.createdAt.seconds * 1000).toLocaleString() 
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {user.lastUpdated 
                        ? new Date(user.lastUpdated.seconds * 1000).toLocaleString() 
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 