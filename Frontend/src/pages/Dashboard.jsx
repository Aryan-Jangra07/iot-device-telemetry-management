import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import DeviceCard from '../components/DeviceCard';
import TelemetryChart from '../components/TelemetryChart';
import { deviceService } from '../services/api';
import { 
  RefreshCcw, 
  Plus, 
  AlertCircle, 
  Layout, 
  Grid2X2, 
  LineChart as LineChartIcon,
  Search,
  Bell,
  CheckCircle2,
  Cpu,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const response = await deviceService.getDevices();
      const safeData = Array.isArray(response.data) ? response.data : [];
      setDevices(safeData);
      if (safeData.length > 0 && !selectedDevice) {
        setSelectedDevice(safeData[0]);
      }
      setLastRefreshed(new Date());
      setError('');
    } catch (err) {
      setError('Connection failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [selectedDevice]);

  const fetchTelemetry = useCallback(async () => {
    // 3. Hardcode deviceId temporarily (for debugging):
    const deviceId = "39424a5f-d62d-4fbf-8694-275912b8e96b";
    
    try {
      const response = await deviceService.getTelemetry(deviceId);
      setTelemetry(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Telemetry fetch failed');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!selectedDevice) return;
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000); // Poll every 3 seconds for live data
    return () => clearInterval(interval);
  }, [selectedDevice, fetchTelemetry]);

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -ml-64 -mb-64" />

        <header className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                Live Console
              </span>
              <p className="text-slate-500 text-xs font-mono">Last refreshed: {lastRefreshed.toLocaleTimeString()}</p>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">Control Center</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search infrastructure..." 
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all w-64"
                />
             </div>
             <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900" />
             </button>
             <button onClick={fetchData} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40">
                <RefreshCcw className="w-4 h-4" />
                Sync
             </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/20">
              <AlertCircle className="text-red-400 w-6 h-6" />
            </div>
            <div>
              <h4 className="text-red-400 font-bold">System Connection Error</h4>
              <p className="text-red-400/70 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          <section className="lg:col-span-1 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-950/80 backdrop-blur-md py-2 z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs">Infrastructure</h3>
              </div>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
                 <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Scanning Network...</p>
              </div>
            ) : devices.length > 0 ? (
              devices.map(device => (
                <DeviceCard 
                  key={device._id} 
                  device={device} 
                  isSelected={selectedDevice?.deviceId === device.deviceId}
                  onSelect={setSelectedDevice}
                />
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-slate-500">No nodes discovered.</p>
              </div>
            )}
          </section>

          <section className="lg:col-span-2 space-y-8">
            {selectedDevice ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all group">
                    <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-500/10 group-hover:bg-blue-600/30 transition-all">
                       <Layout className="text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected Node</p>
                      <h4 className="text-xl font-bold text-white tracking-tighter">{selectedDevice.name}</h4>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all group">
                    <div className="bg-emerald-600/20 p-3 rounded-xl border border-emerald-500/10 group-hover:bg-emerald-600/30 transition-all">
                       <Grid2X2 className="text-emerald-400 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points Harvested</p>
                      <h4 className="text-xl font-bold text-white tracking-tighter">{telemetry.length}</h4>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-all group">
                    <div className="bg-purple-600/20 p-3 rounded-xl border border-purple-500/10 group-hover:bg-purple-600/30 transition-all">
                       <CheckCircle2 className="text-purple-400 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol</p>
                      <h4 className="text-xl font-bold text-white tracking-tighter">MQTT/SSL</h4>
                    </div>
                  </div>
                </div>

                {telemetry.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                    <LineChartIcon className="w-10 h-10 text-slate-700 mb-4" />
                    <p className="text-slate-400 font-bold">No telemetry available</p>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    <TelemetryChart 
                      data={telemetry} 
                      title="Thermal / graph" 
                      dataKey="temperature" 
                      color="#3b82f6" 
                    />
                    <div className="grid md:grid-cols-2 gap-8">
                      <TelemetryChart 
                        data={telemetry} 
                        title="Humidity Index" 
                        dataKey="humidity" 
                        color="#8b5cf6" 
                      />
                      <TelemetryChart 
                        data={telemetry} 
                        title="Voltage Vector" 
                        dataKey="voltage" 
                        color="#ec4899" 
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                <div className="bg-slate-900 p-6 rounded-3xl mb-6 shadow-2xl">
                   <LineChartIcon className="w-16 h-16 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Initialize Monitoring</h3>
                <p className="text-slate-400">Select an active node from the left panel to begin streaming telemetry.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
