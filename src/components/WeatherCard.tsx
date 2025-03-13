
import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Wind, Droplets } from 'lucide-react';
import { WeatherData } from '../utils/cropData';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain className="h-8 w-8 text-agri-blue-dark" />;
      case 'sun':
        return <Sun className="h-8 w-8 text-amber-500" />;
      case 'cloud':
        return <Cloud className="h-8 w-8 text-agri-neutral-400" />;
      case 'cloud-sun':
      default:
        return <CloudSun className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <div className={`agri-card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-agri-neutral-900">Weather Forecast</h3>
        {getWeatherIcon(data.icon)}
      </div>
      
      <div className="mt-4">
        <div className="flex items-end">
          <span className="text-4xl font-bold text-agri-neutral-900">{data.temperature}°C</span>
          <span className="ml-2 text-sm text-agri-neutral-500">{data.description}</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-agri-blue" />
            <span className="ml-2 text-sm text-agri-neutral-600">{data.humidity}% Humidity</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-5 w-5 text-agri-neutral-400" />
            <span className="ml-2 text-sm text-agri-neutral-600">{data.windSpeed} km/h Wind</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-xs font-medium uppercase text-agri-neutral-500 mb-3">7-Day Forecast</h4>
        <div className="flex justify-between overflow-x-auto pb-2">
          {data.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center min-w-[45px]">
              <span className="text-xs text-agri-neutral-600">{day.day}</span>
              <div className="my-1">{getWeatherIcon(day.icon)}</div>
              <span className="text-xs font-medium">{day.temperature}°</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-agri-blue-light rounded-lg">
        <p className="text-sm text-agri-neutral-700">
          <span className="font-medium">Irrigation Advice:</span> Based on the forecast, light irrigation recommended in the next 3 days.
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;
