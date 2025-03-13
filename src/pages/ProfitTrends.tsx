
import { useEffect } from 'react';
import Header from '@/components/Header';
import { handleScrollAnimation } from '@/utils/animations';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample extended data for trends page
const monthlyData = [
  { month: 'Jan', revenue: 45000, expenses: 22000, profit: 23000 },
  { month: 'Feb', revenue: 52000, expenses: 28000, profit: 24000 },
  { month: 'Mar', revenue: 49000, expenses: 24000, profit: 25000 },
  { month: 'Apr', revenue: 63000, expenses: 35000, profit: 28000 },
  { month: 'May', revenue: 59000, expenses: 29000, profit: 30000 },
  { month: 'Jun', revenue: 68000, expenses: 32000, profit: 36000 },
  { month: 'Jul', revenue: 72000, expenses: 38000, profit: 34000 },
  { month: 'Aug', revenue: 65000, expenses: 31000, profit: 34000 },
  { month: 'Sep', revenue: 71000, expenses: 34000, profit: 37000 },
  { month: 'Oct', revenue: 59000, expenses: 30000, profit: 29000 },
  { month: 'Nov', revenue: 55000, expenses: 27000, profit: 28000 },
  { month: 'Dec', revenue: 78000, expenses: 36000, profit: 42000 },
];

const cropPerformance = [
  { name: 'Rice', profit: 105000, area: 12 },
  { name: 'Wheat', profit: 86000, area: 8 },
  { name: 'Cotton', profit: 74000, area: 6 },
  { name: 'Sugarcane', profit: 122000, area: 10 },
  { name: 'Maize', profit: 93000, area: 9 },
];

const ProfitTrends = () => {
  useEffect(() => {
    const cleanupAnimation = handleScrollAnimation();
    return () => cleanupAnimation();
  }, []);

  // Calculate YoY growth
  const totalProfit = monthlyData.reduce((sum, month) => sum + month.profit, 0);
  const previousYearProfit = totalProfit * 0.85; // Simulated previous year profit for demo
  const yoyGrowth = ((totalProfit - previousYearProfit) / previousYearProfit) * 100;

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
            <div className="bg-agri-blue-light rounded-full p-2">
              <TrendingUp className="h-6 w-6 text-agri-blue-dark" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-agri-neutral-900">
              Profit Trends & Analysis
            </h1>
          </div>
          <p className="text-agri-neutral-600 max-w-2xl">
            Detailed insight into your farm's financial performance over time and across different crops.
          </p>
        </div>
      </section>
      
      {/* Key Metrics */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-on-scroll">
            <div className="agri-card p-6">
              <p className="text-sm text-agri-neutral-500">Total Annual Profit</p>
              <h3 className="text-2xl font-bold text-agri-neutral-900 mt-1">₹{totalProfit.toLocaleString()}</h3>
              <div className="mt-2 flex items-center">
                <span className={`text-sm ${yoyGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center`}>
                  {yoyGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(yoyGrowth).toFixed(1)}% YoY
                </span>
              </div>
            </div>
            
            <div className="agri-card p-6">
              <p className="text-sm text-agri-neutral-500">Most Profitable Crop</p>
              <h3 className="text-2xl font-bold text-agri-neutral-900 mt-1">Sugarcane</h3>
              <p className="mt-2 text-sm text-agri-green-dark">₹122,000 total profit</p>
            </div>
            
            <div className="agri-card p-6">
              <p className="text-sm text-agri-neutral-500">Average Profit per Acre</p>
              <h3 className="text-2xl font-bold text-agri-neutral-900 mt-1">₹10,685</h3>
              <p className="mt-2 text-sm text-agri-blue-dark">Across 45 acres</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Monthly Trend Chart */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto animate-on-scroll">
          <div className="agri-card p-6">
            <h2 className="text-xl font-semibold text-agri-neutral-900 mb-6">Monthly Profit Trends</h2>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#B7DFA1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#FDA4AF" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#7DD3FC" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-emerald-50">
                <p className="text-sm text-agri-neutral-600">Highest Revenue Month</p>
                <p className="text-lg font-medium text-agri-neutral-900">December</p>
                <p className="text-sm text-emerald-600">₹78,000</p>
              </div>
              
              <div className="p-4 rounded-lg bg-rose-50">
                <p className="text-sm text-agri-neutral-600">Highest Expense Month</p>
                <p className="text-lg font-medium text-agri-neutral-900">July</p>
                <p className="text-sm text-rose-600">₹38,000</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-sm text-agri-neutral-600">Highest Profit Month</p>
                <p className="text-lg font-medium text-agri-neutral-900">December</p>
                <p className="text-sm text-blue-600">₹42,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Crop Comparison */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="container mx-auto animate-on-scroll">
          <div className="agri-card p-6">
            <h2 className="text-xl font-semibold text-agri-neutral-900 mb-6">Crop Profit Comparison</h2>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cropPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                  <Legend />
                  <Bar dataKey="profit" fill="#86C166" name="Total Profit" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-agri-neutral-900 mb-4">Profit per Acre by Crop</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-agri-neutral-200">
                      <th className="py-3 px-4 text-left text-sm font-medium text-agri-neutral-600">Crop</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-agri-neutral-600">Area (Acres)</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-agri-neutral-600">Total Profit</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-agri-neutral-600">Profit per Acre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropPerformance.map((crop, index) => (
                      <tr key={crop.name} className={index < cropPerformance.length - 1 ? "border-b border-agri-neutral-200" : ""}>
                        <td className="py-3 px-4 text-left text-sm font-medium text-agri-neutral-900">{crop.name}</td>
                        <td className="py-3 px-4 text-right text-sm text-agri-neutral-700">{crop.area}</td>
                        <td className="py-3 px-4 text-right text-sm text-agri-neutral-700">₹{crop.profit.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-agri-green-dark">
                          ₹{Math.round(crop.profit / crop.area).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tips and Insights */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-agri-neutral-100">
        <div className="container mx-auto py-12">
          <h2 className="text-xl font-semibold text-agri-neutral-900 mb-8 animate-on-scroll">
            Insights & Recommendations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 animate-on-scroll">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-agri-neutral-900 mb-4">Profit Maximization Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-agri-green-light text-agri-green-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <span className="text-agri-neutral-700">Consider increasing Sugarcane cultivation area, as it has the highest profit per acre.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-agri-green-light text-agri-green-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <span className="text-agri-neutral-700">December shows the highest profits - plan your crop cycle to maximize harvest during this period.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-agri-green-light text-agri-green-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <span className="text-agri-neutral-700">Your expenses peak in July - consider optimizing costs during this month.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-agri-neutral-900 mb-4">Market Opportunities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-agri-blue-light text-agri-blue-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <span className="text-agri-neutral-700">Current market trends show increasing demand for organic produce - consider transitioning part of your farm.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-agri-blue-light text-agri-blue-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <span className="text-agri-neutral-700">Rice prices are expected to rise by 8% in the coming months - consider holding inventory if possible.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-agri-blue-light text-agri-blue-dark rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <span className="text-agri-neutral-700">Explore direct-to-consumer selling options to increase profit margins across all crops.</span>
                </li>
              </ul>
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

export default ProfitTrends;
