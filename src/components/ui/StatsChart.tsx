import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface StatsData {
  month: string;
  visitors: number;
  posts: number;
  countries: number;
}

const mockData: StatsData[] = [
  { month: 'Jan', visitors: 12500, posts: 8, countries: 3 },
  { month: 'Feb', visitors: 15200, posts: 12, countries: 4 },
  { month: 'Mar', visitors: 18900, posts: 15, countries: 5 },
  { month: 'Apr', visitors: 22100, posts: 18, countries: 6 },
  { month: 'May', visitors: 28500, posts: 22, countries: 7 },
  { month: 'Jun', visitors: 35200, posts: 25, countries: 8 },
];

export default function StatsChart() {
  const [animatedData, setAnimatedData] = useState<StatsData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'visitors' | 'posts' | 'countries'>('visitors');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(mockData);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...mockData.map(d => d[selectedMetric]));

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 200;
  };

  const getColor = (metric: string) => {
    switch (metric) {
      case 'visitors': return 'bg-primary-500';
      case 'posts': return 'bg-secondary-500';
      case 'countries': return 'bg-accent-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
          Growth Analytics
        </h3>
        <div className="flex space-x-2">
          {(['visitors', 'posts', 'countries'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedMetric === metric
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between h-64 space-x-4">
        {animatedData.map((data, index) => (
          <div key={data.month} className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: getBarHeight(data[selectedMetric]) }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
              className={`w-full ${getColor(selectedMetric)} rounded-t-lg relative group cursor-pointer`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {data[selectedMetric].toLocaleString()}
                </div>
              </div>
            </motion.div>
            <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {data.month}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {mockData[mockData.length - 1].visitors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Visitors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-600">
            {mockData.reduce((sum, d) => sum + d.posts, 0)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-600">
            {Math.max(...mockData.map(d => d.countries))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Countries Visited</div>
        </div>
      </div>
    </div>
  );
}

// Simple progress ring component
export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#e35d05' 
}: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number; 
  color?: string; 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {progress}%
        </span>
      </div>
    </div>
  );
}
