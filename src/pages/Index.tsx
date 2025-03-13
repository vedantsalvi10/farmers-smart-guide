
import { useEffect } from 'react';
import Header from '@/components/Header';
import WeatherCard from '@/components/WeatherCard';
import MarketPriceCard from '@/components/MarketPriceCard';
import CropRecommendationCard from '@/components/CropRecommendationCard';
import ProfitTrackingCard from '@/components/ProfitTrackingCard';
import DiseaseDetectionSection from '@/components/DiseaseDetectionSection';
import { cropPrices, weatherData, cropRecommendations, profitData } from '@/utils/cropData';
import { handleScrollAnimation } from '@/utils/animations';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    const cleanupAnimation = handleScrollAnimation();
    return () => cleanupAnimation();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-agri-green-light text-agri-green-dark rounded-full mb-4 animate-fade-in">
              Smart Farming Assistant
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-agri-neutral-900 animate-slide-up">
              AgriCare: Empowering Farmers with Data
            </h1>
            <p className="mt-4 text-lg text-agri-neutral-600 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Make informed decisions, track profits, and maximize your crop yields with our comprehensive farming platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link 
                to="/entry" 
                className="premium-button group"
              >
                Start Tracking
                <ChevronRight className="h-4 w-4 ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/disease-detection"
                className="px-4 py-2 text-agri-neutral-700 border border-agri-neutral-300 rounded-lg hover:bg-agri-neutral-100 transition-colors duration-300 flex items-center group"
              >
                Detect Diseases
                <ArrowUpRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dashboard Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-agri-neutral-900 mb-8 animate-on-scroll">Your Farming Dashboard</h2>
          
          <div className="dashboard-grid animate-on-scroll">
            <WeatherCard data={weatherData} />
            <MarketPriceCard prices={cropPrices} />
            <CropRecommendationCard recommendations={cropRecommendations} />
            <ProfitTrackingCard data={profitData} />
          </div>
        </div>
      </section>
      
      {/* Disease Detection Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-agri-neutral-900 mb-8 animate-on-scroll">Crop Health Analysis</h2>
          
          <div className="animate-on-scroll">
            <DiseaseDetectionSection />
          </div>
        </div>
      </section>
      
      {/* Feature Highlights */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-agri-neutral-100">
        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-semibold text-agri-neutral-900 mb-8 text-center animate-on-scroll">
            Features Designed for Farmers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-on-scroll">
            {[
              {
                title: 'Real-time Market Prices',
                description: 'Stay updated with the latest crop prices to sell at the right time.'
              },
              {
                title: 'Weather Forecast',
                description: 'Plan farming activities based on accurate local weather predictions.'
              },
              {
                title: 'Disease Detection',
                description: 'Identify crop diseases early using image analysis technology.'
              },
              {
                title: 'Profit Tracking',
                description: 'Monitor expenses and revenue to maximize profitability.'
              },
              {
                title: 'Crop Recommendations',
                description: 'Get suggestions on which crops to plant based on local conditions.'
              },
              {
                title: 'Offline Access',
                description: 'Access critical features even in areas with poor connectivity.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-medium text-agri-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-agri-neutral-600">{feature.description}</p>
              </div>
            ))}
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

export default Index;
