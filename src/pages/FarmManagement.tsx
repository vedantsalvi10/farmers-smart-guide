
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { handleScrollAnimation } from '@/utils/animations';
import { ChevronLeft, Sprout, Cloud, Droplets, Timer, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FarmManagement = () => {
  useEffect(() => {
    const cleanupAnimation = handleScrollAnimation();
    return () => cleanupAnimation();
  }, []);

  const [selectedField, setSelectedField] = useState("field-1");
  
  // Sample data
  const fields = [
    { id: "field-1", name: "North Field", area: 12, crop: "Wheat", sowingDate: "2023-10-15", status: "Growing" },
    { id: "field-2", name: "South Field", area: 8, crop: "Rice", sowingDate: "2023-06-10", status: "Ready to Harvest" },
    { id: "field-3", name: "East Field", area: 5, crop: "Cotton", sowingDate: "2023-04-20", status: "Harvested" },
    { id: "field-4", name: "West Field", area: 10, crop: "Sugarcane", sowingDate: "2023-03-05", status: "Growing" },
  ];

  const fieldData = fields.find(field => field.id === selectedField) || fields[0];
  
  // Calculate days since sowing
  const daysSinceSowing = Math.floor((new Date().getTime() - new Date(fieldData.sowingDate).getTime()) / (1000 * 3600 * 24));
  
  // Growth stages for wheat (sample data)
  const growthStages = [
    { name: "Germination", days: 7, complete: true },
    { name: "Seedling", days: 21, complete: true },
    { name: "Tillering", days: 45, complete: daysSinceSowing > 45 },
    { name: "Stem Extension", days: 65, complete: daysSinceSowing > 65 },
    { name: "Heading", days: 85, complete: daysSinceSowing > 85 },
    { name: "Ripening", days: 115, complete: daysSinceSowing > 115 },
  ];
  
  // Current growth stage
  const currentStage = growthStages.findIndex(stage => !stage.complete);
  const currentStageIndex = currentStage === -1 ? growthStages.length - 1 : currentStage;
  
  // Calculate progress percentage for current crop
  const totalGrowthDays = growthStages[growthStages.length - 1].days;
  const growthProgress = Math.min(100, Math.round((daysSinceSowing / totalGrowthDays) * 100));

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      {/* Page Header */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link 
              to="/" 
              className="flex items-center text-sm text-agri-neutral-600 hover:text-agri-green-dark transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-agri-green-light rounded-full p-2">
              <Sprout className="h-6 w-6 text-agri-green-dark" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-agri-neutral-900">
              Farm Management
            </h1>
          </div>
          <p className="text-agri-neutral-600 max-w-2xl">
            Monitor and manage your fields, track crop growth, and schedule farm activities.
          </p>
        </div>
      </section>
      
      {/* Field Selection */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <label htmlFor="field-select" className="block text-sm font-medium text-agri-neutral-700 mb-2">
              Select Field
            </label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="premium-input">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name} ({field.area} acres) - {field.crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      
      {/* Field Overview */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="agri-card p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-agri-neutral-900">{fieldData.name}</h2>
                  <p className="text-agri-neutral-600 mt-1">{fieldData.area} acres • {fieldData.crop}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    fieldData.status === "Growing" 
                      ? "bg-blue-100 text-blue-800" 
                      : fieldData.status === "Ready to Harvest" 
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {fieldData.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Cloud className="h-5 w-5 text-agri-blue mr-2" />
                  <div>
                    <p className="text-xs text-agri-neutral-500">Weather Impact</p>
                    <p className="text-sm font-medium text-agri-neutral-900">Favorable</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 text-agri-blue mr-2" />
                  <div>
                    <p className="text-xs text-agri-neutral-500">Irrigation Status</p>
                    <p className="text-sm font-medium text-agri-neutral-900">Sufficient</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Timer className="h-5 w-5 text-agri-neutral-600 mr-2" />
                  <div>
                    <p className="text-xs text-agri-neutral-500">Days Since Sowing</p>
                    <p className="text-sm font-medium text-agri-neutral-900">{daysSinceSowing} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Crop Growth Status */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-agri-neutral-900 mb-4">Crop Growth Progress</h2>
            
            <div className="agri-card p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-agri-neutral-600">Overall Progress</span>
                <span className="text-sm font-medium text-agri-green-dark">{growthProgress}%</span>
              </div>
              <Progress value={growthProgress} className="h-2" />
              
              <div className="mt-8">
                <h3 className="text-sm font-medium text-agri-neutral-900 mb-4">Growth Stages</h3>
                <div className="space-y-6">
                  {growthStages.map((stage, index) => (
                    <div key={stage.name} className="relative">
                      {/* Timeline connector */}
                      {index < growthStages.length - 1 && (
                        <div 
                          className={`absolute top-6 left-3 w-0.5 h-12 ${
                            index < currentStageIndex ? 'bg-agri-green-dark' : 'bg-agri-neutral-200'
                          }`} 
                        />
                      )}
                      
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          stage.complete 
                            ? 'bg-agri-green-dark text-white' 
                            : index === currentStageIndex 
                            ? 'border-2 border-agri-green-dark bg-white' 
                            : 'bg-agri-neutral-100'
                        }`}>
                          {stage.complete && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h4 className={`text-sm font-medium ${
                              index === currentStageIndex 
                                ? 'text-agri-green-dark' 
                                : 'text-agri-neutral-900'
                            }`}>
                              {stage.name}
                            </h4>
                            {index === currentStageIndex && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-agri-green-light text-agri-green-dark rounded">Current</span>
                            )}
                          </div>
                          <p className="text-xs text-agri-neutral-500 mt-1">
                            {index < currentStageIndex 
                              ? 'Completed' 
                              : index === currentStageIndex 
                              ? `Day ${daysSinceSowing} of approximately ${stage.days} days` 
                              : `Expected around day ${stage.days}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tasks and Recommendations */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-agri-neutral-900 mb-4">Tasks & Recommendations</h2>
            
            <div className="agri-card p-6 mb-6">
              <div className="space-y-4">
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-neutral-900">Fertilizer Application Due</h4>
                    <p className="text-xs text-agri-neutral-600 mt-1">
                      Based on the current growth stage, a nitrogen application is recommended within the next 5 days.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border border-agri-blue-light bg-blue-50 rounded-lg flex items-start">
                  <Droplets className="h-5 w-5 text-agri-blue mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-neutral-900">Irrigation Check</h4>
                    <p className="text-xs text-agri-neutral-600 mt-1">
                      Check soil moisture levels in the northeast corner of the field where drainage may be an issue.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border border-agri-green-light bg-green-50 rounded-lg flex items-start">
                  <Sprout className="h-5 w-5 text-agri-green-dark mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-agri-neutral-900">Crop Health Monitoring</h4>
                    <p className="text-xs text-agri-neutral-600 mt-1">
                      The current growth stage is critical for disease prevention. Consider a preventative fungicide application if rain is forecasted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-agri-neutral-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-lg font-semibold text-agri-neutral-900">AgriCare</span>
              <span className="ml-2 text-xs text-agri-neutral-500 bg-agri-neutral-100 px-2 py-1 rounded">Beta</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-agri-neutral-500">© 2023 AgriCare. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FarmManagement;
