import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

const EntryForm = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call to submit data
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      toast("Entry successfully saved");
      
      // Reset success state after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
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
                  Warning: Expected loss. Consider adjusting costs or expected yield.
                </p>
              )}
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting || success}
              className={`premium-button ${
                success 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-gradient-to-r from-agri-green-dark to-agri-blue-dark'
              } min-w-[120px]`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </span>
              ) : success ? (
                <span className="flex items-center justify-center">
                  <Check className="h-4 w-4 mr-1" />
                  Saved
                </span>
              ) : (
                'Save Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
