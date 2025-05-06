import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CropEntryList from "@/components/CropEntryList";
import DiseaseDetectionList from "@/components/DiseaseDetectionList";
import { useNavigate } from "react-router-dom";
import { Home, User, Sprout, Leaf, Activity, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserProfile = () => {
  const { userData, updateUserProfile, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [activityFilter, setActivityFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Set initial values from user data
  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || "");
      setPhoneNumber(userData.phoneNumber || "");
      setAddress(userData.address || "");
      loadActivityLogs();
    }
  }, [userData]);

  const loadActivityLogs = async () => {
    if (!userData) return;
    
    setIsLoadingLogs(true);
    try {
      const logsRef = collection(db, "activityLogs");
      const q = query(
        logsRef, 
        where("userId", "==", userData.uid),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const logs: any[] = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      
      setActivityLogs(logs);
    } catch (error) {
      console.error("Error loading activity logs:", error);
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive"
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUserProfile({
        displayName,
        phoneNumber,
        address,
      });
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter activity logs based on selected filter
  const filteredLogs = activityLogs.filter(log => {
    if (activityFilter === "all") return true;
    return log.entityType === activityFilter;
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-agri-blue-dark">User Profile</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2"
        >
          <Home size={16} />
          Back to Home
        </Button>
      </div>
      
      {/* Main content in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar with user info and avatar */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="h-24 w-24 rounded-full bg-agri-green-light/30 mb-4 flex items-center justify-center">
                {/* User avatar or placeholder */}
                <User size={40} className="text-agri-green-dark" />
              </div>
              <h2 className="text-xl font-semibold">{userData?.displayName || "User"}</h2>
              <p className="text-gray-500">{userData?.email}</p>
            </div>
            
            {/* Navigation tabs for mobile */}
            <div className="md:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="crops">Crops</TabsTrigger>
                  <TabsTrigger value="diseases">Diseases</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Sidebar navigation for desktop */}
            <div className="hidden md:block">
              <div className="space-y-2">
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile Information
                </Button>
                <Button 
                  variant={activeTab === "crops" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("crops")}
                >
                  <Sprout className="h-4 w-4 mr-2" />
                  Crop Entries
                </Button>
                <Button 
                  variant={activeTab === "diseases" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("diseases")}
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Disease Detections
                </Button>
                <Button 
                  variant={activeTab === "activity" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("activity")}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Activity Log
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-2">
          <Card className="p-6">
            {activeTab === "profile" && (
              <div>
                <CardHeader className="pb-3 px-0">
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </div>
            )}
            
            {activeTab === "crops" && (
              <div>
                <CardHeader className="pb-3 px-0">
                  <CardTitle>Your Crop Entries</CardTitle>
                  <CardDescription>
                    View and manage your crop entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <CropEntryList />
                </CardContent>
              </div>
            )}
            
            {activeTab === "diseases" && (
              <div>
                <CardHeader className="pb-3 px-0">
                  <CardTitle>Disease Detection History</CardTitle>
                  <CardDescription>
                    View your past disease detection results
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <DiseaseDetectionList />
                </CardContent>
              </div>
            )}
            
            {activeTab === "activity" && (
              <div>
                <CardHeader className="pb-3 px-0">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    View your recent actions and changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {/* Activity log with filtering */}
                  <div className="mb-4">
                    <Select 
                      value={activityFilter} 
                      onValueChange={(value) => setActivityFilter(value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter activities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="cropEntries">Crop Entries</SelectItem>
                        <SelectItem value="diseaseDetections">Disease Detections</SelectItem>
                        <SelectItem value="users">User Profile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isLoadingLogs ? (
                    <div className="flex justify-center py-4">
                      <Spinner className="w-6 h-6" />
                    </div>
                  ) : filteredLogs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-agri-neutral-50 rounded-md border border-agri-neutral-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-agri-neutral-500">{log.details}</p>
                              {log.entityType && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-agri-green-light/20 text-agri-green-dark mt-1 inline-block">
                                  {log.entityType}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-agri-neutral-400">
                              {log.timestamp ? new Date(log.timestamp.toDate()).toLocaleString() : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-agri-neutral-500">No activity found</p>
                  )}
                </CardContent>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 