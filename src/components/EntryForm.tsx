import { useState } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/lib/authContext';
import { cropEntryService } from '@/models/cropData';
import { CropEntry } from '@/models/cropData';
import { logActivity } from '@/lib/activityLogger';

const EntryForm = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    cropType: '',
    landArea: '',
    plantingDate: '',
    seedCost: '',
    fertilizerCost: '',
    laborCost: '',
    otherExpenses: '',
    expectedYield: '',
    expectedPrice: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const calculateExpectedProfit = () => {
    const totalExpenses = 
      parseFloat(formData.seedCost || '0') +
      parseFloat(formData.fertilizerCost || '0') +
      parseFloat(formData.laborCost || '0') +
      parseFloat(formData.otherExpenses || '0');
    
    const expectedRevenue = 
      parseFloat(formData.expectedYield || '0') * 
      parseFloat(formData.expectedPrice || '0');
    
    return expectedRevenue - totalExpenses;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    if (!currentUser) {
      setError("You must be logged in to save crop data");
      setSubmitting(false);
      return;
    }
    
    try {
      const expectedProfit = calculateExpectedProfit();
      
      // Create a crop entry object
      const cropEntry: Omit<CropEntry, 'id'> = {
        cropType: formData.cropType,
        landArea: parseFloat(formData.landArea),
        plantingDate: formData.plantingDate,
        seedCost: parseFloat(formData.seedCost || '0'),
        fertilizerCost: parseFloat(formData.fertilizerCost || '0'),
        laborCost: parseFloat(formData.laborCost || '0'),
        otherExpenses: parseFloat(formData.otherExpenses || '0'),
        expectedYield: parseFloat(formData.expectedYield),
        expectedPrice: parseFloat(formData.expectedPrice),
        expectedProfit: expectedProfit,
        status: 'active',
        userId: currentUser.uid
      };
      
      // Save the crop entry
      const savedEntry = await cropEntryService.create(cropEntry, currentUser.uid);
      
      // Log activity
      await logActivity({
        userId: currentUser.uid,
        action: "Added Crop Entry",
        details: `Added ${formData.cropType} crop entry with ${formData.landArea} acres`,
        entityId: savedEntry.id,
        entityType: "cropEntries"
      });
      
      // Show success
      setSuccess(true);
      toast.success("Crop entry successfully saved");
      
      // Reset form
      setFormData({
        cropType: '',
        landArea: '',
        plantingDate: '',
        seedCost: '',
        fertilizerCost: '',
        laborCost: '',
        otherExpenses: '',
        expectedYield: '',
        expectedPrice: ''
      });
      
      // Reset success state after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error saving crop entry:", err);
      setError("Failed to save crop entry. Please try again.");
      toast.error("Failed to save crop entry");
    } finally {
      setSubmitting(false);
    }
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

  const expectedProfit = calculateExpectedProfit();

  return (
    <div className="agri-card max-w-2xl mx-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-agri-neutral-900 mb-6">Crop Data Entry</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-500 text-sm">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {!currentUser && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-600 text-sm">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>You need to login to save crop entries to your account.</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crop Selection */}
            <div>
              <label htmlFor="cropType" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Crop Type
              </label>
              <select
                id="cropType"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="premium-input"
                required
              >
                <option value="">Select crop type</option>
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            
            {/* Land Area */}
            <div>
              <label htmlFor="landArea" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Land Area (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                id="landArea"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                placeholder="e.g. 5.5"
                className="premium-input"
                required
              />
            </div>
            
            {/* Planting Date */}
            <div>
              <label htmlFor="plantingDate" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Planting Date
              </label>
              <input
                type="date"
                id="plantingDate"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleChange}
                className="premium-input"
                required
              />
            </div>
            
            {/* Seed Cost */}
            <div>
              <label htmlFor="seedCost" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Seed Cost (₹)
              </label>
              <input
                type="number"
                id="seedCost"
                name="seedCost"
                value={formData.seedCost}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="premium-input"
                required
              />
            </div>
            
            {/* Fertilizer Cost */}
            <div>
              <label htmlFor="fertilizerCost" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Fertilizer Cost (₹)
              </label>
              <input
                type="number"
                id="fertilizerCost"
                name="fertilizerCost"
                value={formData.fertilizerCost}
                onChange={handleChange}
                placeholder="e.g. 3000"
                className="premium-input"
                required
              />
            </div>
            
            {/* Labor Cost */}
            <div>
              <label htmlFor="laborCost" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Labor Cost (₹)
              </label>
              <input
                type="number"
                id="laborCost"
                name="laborCost"
                value={formData.laborCost}
                onChange={handleChange}
                placeholder="e.g. 8000"
                className="premium-input"
                required
              />
            </div>
            
            {/* Other Expenses */}
            <div>
              <label htmlFor="otherExpenses" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Other Expenses (₹)
              </label>
              <input
                type="number"
                id="otherExpenses"
                name="otherExpenses"
                value={formData.otherExpenses}
                onChange={handleChange}
                placeholder="e.g. 2000"
                className="premium-input"
              />
            </div>
            
            {/* Expected Yield */}
            <div>
              <label htmlFor="expectedYield" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Expected Yield (Quintals)
              </label>
              <input
                type="number"
                id="expectedYield"
                name="expectedYield"
                value={formData.expectedYield}
                onChange={handleChange}
                placeholder="e.g. 60"
                className="premium-input"
                required
              />
            </div>
            
            {/* Expected Price */}
            <div>
              <label htmlFor="expectedPrice" className="block text-sm font-medium text-agri-neutral-700 mb-1">
                Expected Price (₹ per Quintal)
              </label>
              <input
                type="number"
                id="expectedPrice"
                name="expectedPrice"
                value={formData.expectedPrice}
                onChange={handleChange}
                placeholder="e.g. 2000"
                className="premium-input"
                required
              />
            </div>
          </div>
          
          {/* Expected Profit Calculation */}
          {(
            formData.expectedYield !== '' && 
            formData.expectedPrice !== '' && 
            (formData.seedCost !== '' || formData.fertilizerCost !== '' || formData.laborCost !== '')
          ) && (
            <div className="mt-6 p-4 rounded-lg bg-agri-neutral-50 border border-agri-neutral-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-agri-neutral-700">Expected Profit:</span>
                <span className={`text-lg font-bold ${expectedProfit >= 0 ? 'text-agri-green-dark' : 'text-rose-500'}`}>
                  ₹{expectedProfit.toLocaleString()}
                </span>
              </div>
              {expectedProfit < 0 && (
                <p className="mt-2 text-xs text-rose-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Warning: This crop may result in a loss based on your inputs
                </p>
              )}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full premium-button ${success ? 'bg-agri-green border-agri-green' : ''} flex items-center justify-center`}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved Successfully
                </>
              ) : (
                'Save Crop Data'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
