import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';

const TelemetryChart = ({ data, title, dataKey, color }) => {
  const validData = Array.isArray(data) ? data : [];
  const formattedData = validData.map(item => {
    let formattedTime = '';
    try {
      formattedTime = item._time ? format(new Date(item._time), 'HH:mm:ss') : '';
    } catch(e) {}
    return { ...item, formattedTime };
  });
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl shadow-xl h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Live Telemetry Feed</p>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: color }} />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Streaming</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="formattedTime" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #1e293b',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#fff' 
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: '#334155', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#gradient-${dataKey})`}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
