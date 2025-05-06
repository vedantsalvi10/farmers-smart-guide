import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  FirestoreError 
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface TestItem {
  id?: string;
  name: string;
  description: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

const CrudTest = () => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [editingItem, setEditingItem] = useState<TestItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { currentUser, firebaseInitialized } = useAuth();
  const { toast } = useToast();
  
  // Collection name
  const COLLECTION_NAME = "test_items";

  // Check Firebase status
  useEffect(() => {
    if (firebaseInitialized) {
      setFirebaseStatus('success');
    } else {
      setFirebaseStatus('error');
      setError("Firebase is not initialized properly");
    }
  }, [firebaseInitialized]);

  // Load items
  useEffect(() => {
    if (firebaseStatus === 'success') {
      loadItems();
    }
  }, [firebaseStatus]);

  // Handle Firebase errors
  const handleFirestoreError = (error: any, operation: string) => {
    console.error(`Firestore ${operation} error:`, error);
    
    let errorMessage = "An unknown error occurred";
    
    if (error instanceof FirestoreError) {
      switch (error.code) {
        case 'permission-denied':
          errorMessage = "You don't have permission to perform this operation";
          break;
        case 'unavailable':
          errorMessage = "The service is currently unavailable. Please try again later";
          break;
        case 'not-found':
          errorMessage = "The requested document was not found";
          break;
        case 'already-exists':
          errorMessage = "The document already exists";
          break;
        case 'resource-exhausted':
          errorMessage = "Quota exceeded or rate limit reached";
          break;
        case 'failed-precondition':
          errorMessage = "Operation failed due to a failed precondition";
          break;
        default:
          errorMessage = error.message || "An unknown database error occurred";
      }
    } else {
      errorMessage = error.message || "An unknown error occurred";
    }
    
    setError(errorMessage);
    
    toast({
      title: `${operation} Failed`,
      description: errorMessage,
      variant: "destructive"
    });
  };

  // Load all items from Firestore
  const loadItems = async () => {
    setError(null);
    setLoading(true);
    try {
      const itemsCollection = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(itemsCollection);
      
      const loadedItems: TestItem[] = [];
      snapshot.forEach((doc) => {
        loadedItems.push({ 
          id: doc.id, 
          ...doc.data() 
        } as TestItem);
      });
      
      setItems(loadedItems);
    } catch (error) {
      handleFirestoreError(error, "Load");
    } finally {
      setLoading(false);
    }
  };

  // Create a new item
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!itemName.trim()) {
      setError("Item name is required");
      toast({
        title: "Validation Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newItem = {
        name: itemName,
        description: itemDescription,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser?.uid || "anonymous"
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newItem);
      
      // Add to local state
      setItems([...items, { id: docRef.id, ...newItem }]);
      
      // Reset form
      setItemName("");
      setItemDescription("");
      
      toast({
        title: "Success",
        description: "Item created successfully",
      });
    } catch (error) {
      handleFirestoreError(error, "Create");
    } finally {
      setLoading(false);
    }
  };

  // Start editing item
  const startEdit = (item: TestItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingItem(null);
    setItemName("");
    setItemDescription("");
  };

  // Update an item
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!editingItem || !itemName.trim()) {
      setError("Item name is required");
      toast({
        title: "Validation Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const updatedItem = {
        name: itemName,
        description: itemDescription,
        updatedAt: serverTimestamp()
      };
      
      const itemRef = doc(db, COLLECTION_NAME, editingItem.id!);
      await updateDoc(itemRef, updatedItem);
      
      // Update local state
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...updatedItem } 
          : item
      ));
      
      // Reset form
      setEditingItem(null);
      setItemName("");
      setItemDescription("");
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      handleFirestoreError(error, "Update");
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const itemRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(itemRef);
      
      // Update local state
      setItems(items.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      handleFirestoreError(error, "Delete");
    } finally {
      setLoading(false);
    }
  };

  // If Firebase is not initialized
  if (firebaseStatus === 'error') {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Firebase Error</AlertTitle>
          <AlertDescription>
            Firebase is not properly initialized. CRUD operations will not work.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration Status</CardTitle>
            <CardDescription>
              There is an issue with the Firebase configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check the following:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Firebase config is properly set up</li>
              <li>Firestore database is created in the Firebase console</li>
              <li>Authentication is enabled in the Firebase console</li>
              <li>Firestore rules allow read/write operations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">CRUD Testing Page</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>CRUD Test</AlertTitle>
        <AlertDescription>
          This page tests Create, Read, Update, and Delete operations with Firestore.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? "Edit Item" : "Create New Item"}</CardTitle>
            <CardDescription>
              {editingItem 
                ? "Edit the details of an existing item" 
                : "Add a new item to the database"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingItem ? handleUpdate : handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Enter item description"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                  {editingItem ? "Update" : "Create"}
                </Button>
                {editingItem && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              List of all items in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && items.length === 0 ? (
              <div className="flex justify-center py-4">
                <Spinner className="w-6 h-6" />
              </div>
            ) : error && items.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : items.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-gray-500">No items found</p>
                <p className="text-sm text-gray-400 mt-1">Create an item to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="flex justify-end mt-2 space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(item.id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={loadItems} 
              className="w-full"
              disabled={loading}
            >
              {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Refresh
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CrudTest; 