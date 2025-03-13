
import { useState } from 'react';
import { Upload, X, Check, AlertTriangle, Loader2 } from 'lucide-react';

const DiseaseDetectionSection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ healthy: boolean; disease?: string; confidence: number } | null>(null);

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
        setResult({
          healthy: false,
          disease: diseases[Math.floor(Math.random() * diseases.length)],
          confidence: 70 + Math.random() * 20
        });
      }
      
      setLoading(false);
    }, 2000);
  };

  const resetImage = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="agri-card p-5">
      <h3 className="text-lg font-semibold text-agri-neutral-900">Disease Detection</h3>
      
      {!image ? (
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
          />
        </div>
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
              {!result.healthy && (
                <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                  <h5 className="text-sm font-medium text-amber-700">Recommended Action:</h5>
                  <p className="mt-1 text-xs text-agri-neutral-600">
                    Apply fungicide treatment. Remove affected leaves and ensure proper air circulation.
                    Consider consulting with a local agriculture expert.
                  </p>
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
