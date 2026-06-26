import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const VisualAnalytics = ({ cutoffs, expectedPercentile }) => {
  // Process the cutoffs for the chart
  // Expecting cutoffs: [{ academicYear: 2021, closingPercentile: 94.2 }, ...]
  
  // If no cutoffs, we create some mock data to show how it looks for now
  const defaultData = [
    { year: '2021', percentile: expectedPercentile - 1.2 },
    { year: '2022', percentile: expectedPercentile + 0.5 },
    { year: '2023', percentile: expectedPercentile - 0.2 },
    { year: '2024', percentile: expectedPercentile },
  ];

  let data = defaultData;

  if (cutoffs && cutoffs.length > 0) {
    // Map existing data and sort by year
    data = cutoffs.map(c => ({
      year: c.academicYear.toString(),
      percentile: c.closingPercentile
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }

  // Define Y-axis bounds nicely
  const minPercentile = Math.max(0, Math.min(...data.map(d => d.percentile)) - 2);
  const maxPercentile = Math.min(100, Math.max(...data.map(d => d.percentile)) + 2);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1">Year {label}</p>
          <p className="text-white font-bold">Percentile: {payload[0].value.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-48 mt-4 bg-white/5 rounded-xl border border-white/5 p-4">
      <h4 className="text-xs font-semibold text-gray-400 mb-4">Historical Cutoff Trend (5 Years)</h4>
      <div className="w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#666" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              domain={[minPercentile, maxPercentile]} 
              stroke="#666" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="percentile" 
              stroke="#a855f7" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#000' }}
              activeDot={{ r: 6, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisualAnalytics;
