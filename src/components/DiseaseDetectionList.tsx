import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { diseaseDetectionService } from '@/models/cropData';
import { DiseaseDetection } from '@/models/cropData';
import { where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Microscope, AlertTriangle } from 'lucide-react';

const DiseaseDetectionList = () => {
  const [detections, setDetections] = useState<DiseaseDetection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadDetections = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Load detections for the current user
        const entries = await diseaseDetectionService.getAll([where('userId', '==', currentUser.uid)]);
        setDetections(entries.sort((a, b) => {
          // Sort by createdAt date, newest first
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        }));
      } catch (error) {
        console.error('Error loading disease detections:', error);
        setError('Failed to load your disease detection history');
      } finally {
        setLoading(false);
      }
    };
    
    loadDetections();
  }, [currentUser]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'bg-amber-100 text-amber-800';
      case 'treated':
        return 'bg-emerald-100 text-emerald-800';
      case 'unidentified':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <CardTitle>Disease Detections</CardTitle>
          <CardDescription>You need to log in to view your detection history</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (detections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Disease Detections</CardTitle>
          <CardDescription>You haven't performed any disease detection scans yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-agri-neutral-500 text-center py-4">
            Use the disease detection tool to identify crop diseases
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disease Detection History</CardTitle>
        <CardDescription>Your previous disease detection scans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {detections.map((detection) => (
            <div 
              key={detection.id} 
              className="p-4 border rounded-md hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  {detection.imageUrl ? (
                    <img 
                      src={detection.imageUrl} 
                      alt="Crop" 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-agri-neutral-100 rounded-md flex items-center justify-center">
                      <Microscope className="h-6 w-6 text-agri-neutral-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{detection.diseaseIdentified || 'Unknown Disease'}</h3>
                      <Badge className={`ml-2 ${getStatusColor(detection.status)}`}>
                        {detection.status.charAt(0).toUpperCase() + detection.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-agri-neutral-500 mt-1">
                      {detection.cropType} • 
                      {detection.confidence ? ` ${detection.confidence.toFixed(1)}% confidence` : ''}
                    </p>
                    <p className="text-xs text-agri-neutral-400 mt-1">
                      {detection.createdAt ? new Date(detection.createdAt.toDate()).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
              </div>
              
              {detection.recommendations && detection.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-agri-neutral-200">
                  <h4 className="text-sm font-medium text-agri-neutral-700 mb-1">Recommendations:</h4>
                  <ul className="text-xs text-agri-neutral-600 list-disc pl-4">
                    {detection.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                    {detection.recommendations.length > 2 && (
                      <li className="text-agri-blue cursor-pointer">+ {detection.recommendations.length - 2} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseDetectionList; 