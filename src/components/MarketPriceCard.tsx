
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { CropPrice } from '../utils/cropData';

interface MarketPriceCardProps {
  prices: CropPrice[];
}

const MarketPriceCard = ({ prices }: MarketPriceCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [visiblePrices, setVisiblePrices] = useState<CropPrice[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisiblePrices(prices.slice(0, 3));
  }, [prices]);

  const handleShowAll = () => {
    setShowAll(true);
    setVisiblePrices(prices);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      case 'stable':
      default:
        return <Minus className="h-4 w-4 text-agri-neutral-400" />;
    }
  };

  return (
    <div className={`agri-card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-lg font-semibold text-agri-neutral-900">Market Prices</h3>
      
      <div className="mt-4 space-y-4">
        {visiblePrices.map((crop) => (
          <div 
            key={crop.id} 
            className="flex items-center justify-between p-3 bg-agri-neutral-50 rounded-lg hover:bg-agri-neutral-100 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-agri-neutral-900">{crop.name}</h4>
              <p className="text-xs text-agri-neutral-500">per {crop.unit}</p>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="font-semibold text-agri-neutral-900">₹{crop.currentPrice.toLocaleString()}</span>
              <div className="flex items-center mt-1">
                {getTrendIcon(crop.trend)}
                <span 
                  className={`text-xs ml-1 ${
                    crop.trend === 'up' 
                      ? 'text-emerald-500' 
                      : crop.trend === 'down' 
                      ? 'text-rose-500' 
                      : 'text-agri-neutral-500'
                  }`}
                >
                  {crop.percentChange > 0 ? '+' : ''}{crop.percentChange}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!showAll && prices.length > 3 && (
        <button 
          onClick={handleShowAll}
          className="mt-4 w-full py-2 flex items-center justify-center text-sm text-agri-neutral-600 hover:text-agri-green-dark transition-colors duration-200"
        >
          <span>See all prices</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      )}
      
      <div className="mt-5 pt-4 border-t border-agri-neutral-200">
        <p className="text-xs text-agri-neutral-600">
          Last updated: Today at 9:30 AM
        </p>
      </div>
    </div>
  );
};

export default MarketPriceCard;
