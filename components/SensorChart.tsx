
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SensorData } from '../types';

interface SensorChartProps {
  data: SensorData[];
}

const SensorChart: React.FC<SensorChartProps> = ({ data }) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="timestamp" hide />
          <YAxis stroke="#059669" fontSize={10} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #059669', fontSize: '10px' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Line type="monotone" dataKey="accelX" stroke="#ef4444" strokeWidth={1} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="accelY" stroke="#3b82f6" strokeWidth={1} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="accelZ" stroke="#10b981" strokeWidth={1} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
