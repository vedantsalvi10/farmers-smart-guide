import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Clock, BarChart, Sprout, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  entityId?: string;
  entityType?: string;
  timestamp: any;
}

const UserActivityCard = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadActivityLogs = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      try {
        const logsRef = collection(db, "activityLogs");
        const q = query(
          logsRef, 
          where("userId", "==", currentUser.uid),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const logs: ActivityLog[] = [];
        querySnapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
        });
        
        setActivityLogs(logs);
      } catch (error) {
        console.error("Error loading activity logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivityLogs();
  }, [currentUser]);

  // Get icon based on activity type
  const getActivityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'cropEntries':
        return <Sprout className="h-4 w-4 text-agri-green" />;
      case 'diseaseDetections':
        return <Microscope className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-agri-blue" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    
    // If today, just show time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest farming activities</CardDescription>
          </div>
          {currentUser && (
            <Link 
              to="/profile" 
              className="text-xs text-agri-blue hover:underline"
            >
              View all
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner className="w-6 h-6" />
          </div>
        ) : !currentUser ? (
          <div className="text-center py-6 text-agri-neutral-500">
            <p>Sign in to view your activities</p>
            <Link 
              to="/login" 
              className="mt-2 inline-block text-sm text-agri-blue hover:underline"
            >
              Log in
            </Link>
          </div>
        ) : activityLogs.length > 0 ? (
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start p-2 rounded-md bg-agri-neutral-50 hover:bg-agri-neutral-100 transition-colors duration-200">
                <div className="mr-3 mt-0.5">
                  {getActivityIcon(log.entityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{log.action}</p>
                  <p className="text-xs text-agri-neutral-500 truncate">{log.details}</p>
                  <p className="text-xs text-agri-neutral-400 mt-1">
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-agri-neutral-500">
            <p>No activities yet</p>
            <Link 
              to="/entry" 
              className="mt-2 inline-block text-sm text-agri-blue hover:underline"
            >
              Start tracking crops
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityCard; 