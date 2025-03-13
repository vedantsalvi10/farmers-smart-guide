
export interface CropPrice {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  precipitation: number;
  icon: string;
  forecast: Array<{
    day: string;
    temperature: number;
    icon: string;
  }>;
}

export interface CropRecommendation {
  id: string;
  name: string;
  suitability: 'Excellent' | 'Good' | 'Average' | 'Poor';
  waterRequirement: 'Low' | 'Medium' | 'High';
  harvestTime: number; // in days
  profitPotential: 'High' | 'Medium' | 'Low';
  icon: string;
}

export interface ProfitData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// Mock crop price data
export const cropPrices: CropPrice[] = [
  {
    id: '1',
    name: 'Rice',
    currentPrice: 2200,
    previousPrice: 2100,
    unit: 'quintal',
    trend: 'up',
    percentChange: 4.76
  },
  {
    id: '2',
    name: 'Wheat',
    currentPrice: 2050,
    previousPrice: 2100,
    unit: 'quintal',
    trend: 'down',
    percentChange: -2.38
  },
  {
    id: '3',
    name: 'Cotton',
    currentPrice: 6500,
    previousPrice: 6300,
    unit: 'quintal',
    trend: 'up',
    percentChange: 3.17
  },
  {
    id: '4',
    name: 'Sugarcane',
    currentPrice: 280,
    previousPrice: 280,
    unit: 'quintal',
    trend: 'stable',
    percentChange: 0
  },
  {
    id: '5',
    name: 'Maize',
    currentPrice: 1850,
    previousPrice: 1900,
    unit: 'quintal',
    trend: 'down',
    percentChange: -2.63
  },
  {
    id: '6',
    name: 'Soybeans',
    currentPrice: 3800,
    previousPrice: 3700,
    unit: 'quintal',
    trend: 'up',
    percentChange: 2.70
  }
];

// Mock weather data
export const weatherData: WeatherData = {
  temperature: 32,
  humidity: 65,
  description: 'Partly Cloudy',
  windSpeed: 12,
  precipitation: 20,
  icon: 'cloud-sun',
  forecast: [
    { day: 'Mon', temperature: 32, icon: 'cloud-sun' },
    { day: 'Tue', temperature: 34, icon: 'sun' },
    { day: 'Wed', temperature: 33, icon: 'sun' },
    { day: 'Thu', temperature: 30, icon: 'cloud-rain' },
    { day: 'Fri', temperature: 29, icon: 'cloud-rain' },
    { day: 'Sat', temperature: 31, icon: 'cloud' },
    { day: 'Sun', temperature: 33, icon: 'sun' }
  ]
};

// Mock crop recommendations based on current season and weather
export const cropRecommendations: CropRecommendation[] = [
  {
    id: '1',
    name: 'Paddy Rice',
    suitability: 'Excellent',
    waterRequirement: 'High',
    harvestTime: 120,
    profitPotential: 'High',
    icon: 'seedling'
  },
  {
    id: '2',
    name: 'Cotton',
    suitability: 'Good',
    waterRequirement: 'Medium',
    harvestTime: 180,
    profitPotential: 'High',
    icon: 'flower'
  },
  {
    id: '3',
    name: 'Sugarcane',
    suitability: 'Average',
    waterRequirement: 'High',
    harvestTime: 360,
    profitPotential: 'Medium',
    icon: 'bamboo'
  },
  {
    id: '4',
    name: 'Soybeans',
    suitability: 'Good',
    waterRequirement: 'Medium',
    harvestTime: 100,
    profitPotential: 'Medium',
    icon: 'sprout'
  }
];

// Mock profit tracking data
export const profitData: ProfitData[] = [
  { month: 'Jan', revenue: 45000, expenses: 30000, profit: 15000 },
  { month: 'Feb', revenue: 52000, expenses: 32000, profit: 20000 },
  { month: 'Mar', revenue: 48000, expenses: 29000, profit: 19000 },
  { month: 'Apr', revenue: 61000, expenses: 35000, profit: 26000 },
  { month: 'May', revenue: 55000, expenses: 33000, profit: 22000 },
  { month: 'Jun', revenue: 67000, expenses: 39000, profit: 28000 }
];
