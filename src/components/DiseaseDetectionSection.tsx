import { useState } from 'react';
import { Upload, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { diseaseDetectionService } from '@/models/cropData';
import { DiseaseDetection } from '@/models/cropData';
import { logActivity } from '@/lib/activityLogger';
import { toast } from 'sonner';

const DiseaseDetectionSection = () => {
  const { currentUser } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ healthy: boolean; disease?: string; confidence: number } | null>(null);
  const [selectedCropType, setSelectedCropType] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setLoading(true);
    setResult(null);
    
    // Simulate API call for disease detection
    setTimeout(() => {
      // For demo purposes, randomly determine if healthy
      const isHealthy = Math.random() > 0.5;
      
      if (isHealthy) {
        setResult({
          healthy: true,
          confidence: 95 + Math.random() * 5
        });
      } else {
        const diseases = [
          'Leaf Spot',
          'Powdery Mildew',
          'Rust',
          'Bacterial Blight'
        ];
        const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const confidence = 70 + Math.random() * 20;
        
        setResult({
          healthy: false,
          disease: detectedDisease,
          confidence: confidence
        });
        
        // Save to Firebase if user is logged in
        if (currentUser) {
          saveDiseaseDetection(detectedDisease, confidence);
        }
      }
      
      setLoading(false);
    }, 2000);
  };

  const saveDiseaseDetection = async (disease: string, confidence: number) => {
    if (!currentUser) return;
    
    try {
      // Create a disease detection object
      const diseaseDetection: Omit<DiseaseDetection, 'id'> = {
        cropType: selectedCropType || 'Unknown',
        imageUrl: image || '',
        diseaseIdentified: disease,
        confidence: confidence,
        symptoms: getSymptoms(disease),
        recommendations: getRecommendations(disease),
        status: 'identified',
        userId: currentUser.uid
      };
      
      // Save the disease detection
      const savedDetection = await diseaseDetectionService.create(diseaseDetection, currentUser.uid);
      
      // Log activity
      await logActivity({
        userId: currentUser.uid,
        action: "Disease Detection",
        details: `Detected ${disease} on ${selectedCropType || 'crop'} with ${confidence.toFixed(1)}% confidence`,
        entityId: savedDetection.id,
        entityType: "diseaseDetections"
      });
      
      toast.success("Disease detection saved to your records");
    } catch (err) {
      console.error("Error saving disease detection:", err);
    }
  };

  // Helper functions to get symptoms and recommendations
  const getSymptoms = (disease: string): string[] => {
    switch (disease) {
      case 'Leaf Spot':
        return ['Brown or black spots on leaves', 'Yellowing around spots', 'Premature leaf drop'];
      case 'Powdery Mildew':
        return ['White powdery substance on leaves', 'Curling or distortion of leaves', 'Stunted growth'];
      case 'Rust':
        return ['Orange-brown pustules on leaves', 'Yellowing of affected tissue', 'Defoliation'];
      case 'Bacterial Blight':
        return ['Water-soaked lesions', 'Wilting of leaves', 'Yellow halos around lesions'];
      default:
        return ['Unknown symptoms'];
    }
  };

  const getRecommendations = (disease: string): string[] => {
    switch (disease) {
      case 'Leaf Spot':
        return ['Remove and destroy affected leaves', 'Apply approved fungicide', 'Ensure adequate spacing between plants'];
      case 'Powdery Mildew':
        return ['Apply sulfur-based fungicide', 'Increase air circulation', 'Avoid overhead watering'];
      case 'Rust':
        return ['Apply fungicide at first sign', 'Remove infected plant debris', 'Rotate crops in following seasons'];
      case 'Bacterial Blight':
        return ['Use copper-based bactericide', 'Avoid working with wet plants', 'Practice crop rotation'];
      default:
        return ['Consult with agricultural expert'];
    }
  };

  const resetImage = () => {
    setImage(null);
    setResult(null);
    setSelectedCropType('');
  };

  const cropTypes = [
    'Rice',
    'Wheat',
    'Cotton',
    'Sugarcane',
    'Maize',
    'Soybeans',
    'Potato',
    'Tomato',
    'Onion',
    'Other'
  ];

  return (
    <div className="agri-card p-5">
      <h3 className="text-lg font-semibold text-agri-neutral-900">Disease Detection</h3>
      
      {!currentUser && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-600 text-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Log in to save detection results to your account and track disease history.</p>
          </div>
        </div>
      )}
      
      {!image ? (
        <>
          <div className="mt-4">
            <label htmlFor="cropType" className="block text-sm font-medium text-agri-neutral-700 mb-1">
              Crop Type
            </label>
            <select
              id="cropType"
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(e.target.value)}
              className="premium-input"
            >
              <option value="">Select crop type</option>
              {cropTypes.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-300 ${
              isDragging 
                ? 'border-agri-green bg-agri-green-light/20' 
                : 'border-agri-neutral-300 hover:border-agri-green-dark hover:bg-agri-neutral-100'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-agri-neutral-400" />
            <p className="mt-3 text-sm text-agri-neutral-600 text-center">
              Drag & drop an image of your crop here,<br /> or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
              aria-label="Upload crop image"
              title="Upload crop image"
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <div className="relative">
            <img 
              src={image} 
              alt="Uploaded crop" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={resetImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-agri-neutral-100 transition-colors duration-200"
              aria-label="Remove image"
            >
              <X className="h-5 w-5 text-agri-neutral-600" />
            </button>
          </div>
          
          {loading ? (
            <div className="mt-4 flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 text-agri-green-dark mr-2" />
              <span className="text-sm text-agri-neutral-600">Analyzing image...</span>
            </div>
          ) : result ? (
            <div className={`mt-4 p-4 rounded-lg ${result.healthy ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <div className="flex items-center">
                {result.healthy ? (
                  <Check className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <h4 className={`ml-2 font-medium ${result.healthy ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.healthy ? 'Healthy Plant Detected' : `Detected: ${result.disease}`}
                </h4>
              </div>
              <p className="mt-2 text-sm text-agri-neutral-600">
                Confidence: {result.confidence.toFixed(1)}%
              </p>
              {!result.healthy && result.disease && (
                <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                  <h5 className="text-sm font-medium text-amber-700">Symptoms:</h5>
                  <ul className="mt-1 text-xs text-agri-neutral-600 list-disc pl-4">
                    {getSymptoms(result.disease).map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                  
                  <h5 className="mt-2 text-sm font-medium text-amber-700">Recommended Action:</h5>
                  <ul className="mt-1 text-xs text-agri-neutral-600 list-disc pl-4">
                    {getRecommendations(result.disease).map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
      
      <div className="mt-5 pt-4 border-t border-agri-neutral-200">
        <p className="text-xs text-agri-neutral-600">
          Upload a clear, well-lit image of your crop for best results
        </p>
      </div>
    </div>
  );
};

export default DiseaseDetectionSection;
