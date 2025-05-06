import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { cropEntryService } from '@/models/cropData';
import { CropEntry } from '@/models/cropData';
import { where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

const CropEntryList = () => {
  const [cropEntries, setCropEntries] = useState<CropEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadCropEntries = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Load entries for the current user
        const entries = await cropEntryService.getAll([where('userId', '==', currentUser.uid)]);
        setCropEntries(entries.sort((a, b) => {
          // Sort by createdAt date, newest first
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        }));
      } catch (error) {
        console.error('Error loading crop entries:', error);
        setError('Failed to load your crop entries');
      } finally {
        setLoading(false);
      }
    };
    
    loadCropEntries();
  }, [currentUser]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'harvested':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days since planting
  const getDaysSincePlanting = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const plantingDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - plantingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-md text-rose-500">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crop Entries</CardTitle>
          <CardDescription>You need to log in to view your crop entries</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (cropEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crop Entries</CardTitle>
          <CardDescription>You haven't added any crop entries yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-agri-neutral-500 text-center py-4">
            Start tracking your crops to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Crop Entries</CardTitle>
        <CardDescription>Track your crops and monitor their progress</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="harvested">Harvested</TabsTrigger>
            <TabsTrigger value="all">All Entries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="space-y-4">
              {cropEntries.filter(entry => entry.status === 'active').map(entry => (
                <CropEntryItem key={entry.id} entry={entry} />
              ))}
              {cropEntries.filter(entry => entry.status === 'active').length === 0 && (
                <p className="text-center py-4 text-agri-neutral-500">No active crops</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="harvested">
            <div className="space-y-4">
              {cropEntries.filter(entry => entry.status === 'harvested').map(entry => (
                <CropEntryItem key={entry.id} entry={entry} />
              ))}
              {cropEntries.filter(entry => entry.status === 'harvested').length === 0 && (
                <p className="text-center py-4 text-agri-neutral-500">No harvested crops yet</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {cropEntries.map(entry => (
                <CropEntryItem key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for individual crop entry
const CropEntryItem = ({ entry }: { entry: CropEntry }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'harvested':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 border rounded-md hover:shadow-sm transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{entry.cropType}</h3>
            <Badge className={`ml-2 ${getStatusColor(entry.status)}`}>
              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-agri-neutral-500 mt-1">
            {entry.landArea} acres • Planted on {new Date(entry.plantingDate).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className={`flex items-center font-medium ${entry.expectedProfit >= 0 ? 'text-agri-green-dark' : 'text-rose-500'}`}>
            {entry.expectedProfit >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            ₹{Math.abs(entry.expectedProfit).toLocaleString()}
          </div>
          <p className="text-xs text-agri-neutral-400">Expected profit</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-agri-neutral-200 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-agri-neutral-500">Seed Cost:</span>{' '}
          <span className="font-medium">₹{entry.seedCost.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-agri-neutral-500">Fertilizer:</span>{' '}
          <span className="font-medium">₹{entry.fertilizerCost.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-agri-neutral-500">Expected Yield:</span>{' '}
          <span className="font-medium">{entry.expectedYield} quintals</span>
        </div>
        <div>
          <span className="text-agri-neutral-500">Price/Quintal:</span>{' '}
          <span className="font-medium">₹{entry.expectedPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CropEntryList; 