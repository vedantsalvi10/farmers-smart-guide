
import { useState, useEffect } from 'react';
import { Droplets, Clock, CreditCard, Seedling, Flower2, Sprout } from 'lucide-react';
import { CropRecommendation } from '../utils/cropData';

interface CropRecommendationCardProps {
  recommendations: CropRecommendation[];
}

const CropRecommendationCard = ({ recommendations }: CropRecommendationCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getWaterRequirementColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low':
        return 'text-sky-400';
      case 'Medium':
        return 'text-sky-600';
      case 'High':
        return 'text-sky-800';
    }
  };

  const getProfitPotentialColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low':
        return 'text-amber-500';
      case 'Medium':
        return 'text-amber-600';
      case 'High':
        return 'text-amber-700';
    }
  };

  const getSuitabilityColor = (level: 'Excellent' | 'Good' | 'Average' | 'Poor') => {
    switch (level) {
      case 'Excellent':
        return 'bg-emerald-500';
      case 'Good':
        return 'bg-green-500';
      case 'Average':
        return 'bg-amber-500';
      case 'Poor':
        return 'bg-rose-500';
    }
  };

  const getCropIcon = (iconName: string) => {
    switch (iconName) {
      case 'flower':
        return <Flower2 className="h-5 w-5" />;
      case 'sprout':
        return <Sprout className="h-5 w-5" />;
      case 'seedling':
      default:
        return <Seedling className="h-5 w-5" />;
    }
  };

  return (
    <div className={`agri-card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-lg font-semibold text-agri-neutral-900">Recommended Crops</h3>
      
      <div className="mt-4 relative overflow-hidden rounded-lg">
        {recommendations.map((crop, index) => (
          <div 
            key={crop.id}
            className={`transition-all duration-500 ${
              index === activeIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
            }`}
          >
            <div className="bg-agri-neutral-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-agri-green-light text-agri-green-dark">
                  {getCropIcon(crop.icon)}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-agri-neutral-900">{crop.name}</h4>
                  <div className="flex items-center mt-1">
                    <span 
                      className={`inline-block h-2 w-2 rounded-full ${getSuitabilityColor(crop.suitability)} mr-1`}
                    ></span>
                    <span className="text-xs text-agri-neutral-600">{crop.suitability} Suitability</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-md">
                  <Droplets className={`h-4 w-4 mx-auto ${getWaterRequirementColor(crop.waterRequirement)}`} />
                  <span className="block text-xs mt-1 text-agri-neutral-600">{crop.waterRequirement}</span>
                  <span className="block text-xs text-agri-neutral-500">Water</span>
                </div>
                
                <div className="p-2 bg-white rounded-md">
                  <Clock className="h-4 w-4 mx-auto text-agri-neutral-600" />
                  <span className="block text-xs mt-1 text-agri-neutral-600">{crop.harvestTime}</span>
                  <span className="block text-xs text-agri-neutral-500">Days</span>
                </div>
                
                <div className="p-2 bg-white rounded-md">
                  <CreditCard className={`h-4 w-4 mx-auto ${getProfitPotentialColor(crop.profitPotential)}`} />
                  <span className="block text-xs mt-1 text-agri-neutral-600">{crop.profitPotential}</span>
                  <span className="block text-xs text-agri-neutral-500">Profit</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center space-x-1">
        {recommendations.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-agri-green-dark w-4' : 'bg-agri-neutral-300'
            }`}
            aria-label={`View recommendation ${index + 1}`}
          ></button>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-agri-neutral-200">
        <p className="text-xs text-agri-neutral-600">
          Recommendations based on current season and local conditions
        </p>
      </div>
    </div>
  );
};

export default CropRecommendationCard;
