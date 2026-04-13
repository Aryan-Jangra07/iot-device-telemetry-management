import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, Activity, PieChart, Loader2 } from 'lucide-react';
import { deviceService } from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await deviceService.getAnalytics();
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Infrastructure Nodes', value: data?.totalDevices || 0, trend: 'Total', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
    { label: 'Active Streams', value: data?.onlineDevices || 0, trend: 'Online', color: 'text-blue-400', bg: 'bg-blue-600/20' },
    { label: 'Throughput', value: data?.throughput || '0/min', trend: 'Global', color: 'text-purple-400', bg: 'bg-purple-600/20' },
    { label: 'System Uptime', value: data?.uptime || '100%', trend: '99.9% SLI', color: 'text-pink-400', bg: 'bg-pink-600/20' },
  ];

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-10 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-pink-600/20 text-pink-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-pink-500/20">
              Insight Engine
            </span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Analytics</h2>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.bg} ${stat.color} border border-white/5`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl h-80 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Data Trends Coming Soon</h3>
            <p className="text-slate-500 text-sm max-w-xs">Detailed historical analysis and predictive insights are currently under development.</p>
          </div>
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl h-80 flex flex-col items-center justify-center text-center shadow-sm">
             <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
              <PieChart className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Distribution Analysis</h3>
            <p className="text-slate-500 text-sm max-w-xs">Geographical and functional distribution of your infrastructure nodes.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
