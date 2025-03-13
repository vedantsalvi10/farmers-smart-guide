
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ProfitData } from '../utils/cropData';

interface ProfitTrackingCardProps {
  data: ProfitData[];
}

const ProfitTrackingCard = ({ data }: ProfitTrackingCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-agri-neutral-200">
          <p className="text-sm font-medium mb-1">{`${label}`}</p>
          <p className="text-xs text-agri-green-dark">{`Revenue: ₹${payload[0].value}`}</p>
          <p className="text-xs text-rose-500">{`Expenses: ₹${payload[1].value}`}</p>
          <p className="text-xs font-medium text-agri-blue-dark mt-1">{`Profit: ₹${payload[2].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate total profit
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className={`agri-card p-5 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-agri-neutral-900">Profit Tracking</h3>
        <div className="text-right">
          <p className="text-xs text-agri-neutral-500">Total Profit (6 months)</p>
          <p className="text-xl font-bold text-agri-green-dark">₹{totalProfit.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={0}
            barSize={8}
          >
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="revenue" fill="#B7DFA1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#FDA4AF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#7DD3FC" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 flex justify-center space-x-6">
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-agri-green-dark"></span>
          <span className="ml-2 text-xs text-agri-neutral-600">Revenue</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-rose-400"></span>
          <span className="ml-2 text-xs text-agri-neutral-600">Expenses</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-agri-blue"></span>
          <span className="ml-2 text-xs text-agri-neutral-600">Profit</span>
        </div>
      </div>
    </div>
  );
};

export default ProfitTrackingCard;
