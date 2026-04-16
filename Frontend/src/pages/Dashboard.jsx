import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import DeviceCard from '../components/DeviceCard';
import TelemetryChart from '../components/TelemetryChart';
import { CardSkeleton, ChartSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import OnboardingModal from '../components/OnboardingModal';
import { deviceService } from '../services/api';
import { connectSocket, subscribeStatus } from '../services/socket';
import useDeviceStore from '../store/deviceStore';
import { 
  RefreshCcw, Plus, Layout, Grid2X2, LineChart as LineChartIcon,
  Search, Bell, CheckCircle2, Cpu, Power
} from 'lucide-react';

const Dashboard = () => {
  const { devices, isLoading: devicesLoading, fetchDevices, updateDeviceStatus } = useDeviceStore();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sync state between store and local selection
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Global subscriptions for device status changes
  useEffect(() => {
    if (!devices.length) return;
    const unsubscribes = devices.map(device => 
      subscribeStatus(device.deviceId, (data) => {
        updateDeviceStatus(data.deviceId, data.status);
      })
    );
    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [devices, updateDeviceStatus]);

  // Keep selectedDevice perfectly in sync with the store's devices array
  useEffect(() => {
    if (selectedDevice) {
      const updatedMatch = devices.find(d => d.deviceId === selectedDevice.deviceId);
      if (updatedMatch && updatedMatch.status !== selectedDevice.status) {
        setSelectedDevice(updatedMatch);
      }
    }
  }, [devices, selectedDevice]);

  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0]);
    }
    // Auto-open onboarding if no devices after initial load
    if (!devicesLoading && devices.length === 0) {
      setIsOnboardingOpen(true);
    }
  }, [devices, devicesLoading, selectedDevice]);

  const fetchTelemetry = useCallback(async (isInitial = false) => {
    if (!selectedDevice?.deviceId) return;
    if (isInitial) setIsTelemetryLoading(true);
    
    try {
      const response = await deviceService.getTelemetry(selectedDevice.deviceId);
      setTelemetry(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Telemetry fetch failed', err);
      setTelemetry([]);
    } finally {
      if (isInitial) setIsTelemetryLoading(false);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (!selectedDevice) return;
    
    // Initial data fetch
    fetchTelemetry(true);

    // Subscribe to real-time updates
    const unsubscribe = connectSocket(selectedDevice.deviceId, (newPoint) => {
      setTelemetry((prev) => {
        const updated = [...prev, newPoint];
        // Keep only last 50 points to prevent performance degradation
        return updated.slice(-50);
      });
      setLastRefreshed(new Date());
    });

    return () => {
      unsubscribe();
    };
  }, [selectedDevice, fetchTelemetry]);

  const handleSync = () => {
    fetchDevices();
    setLastRefreshed(new Date());
  };

  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />

        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600/20 text-blue-500 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-blue-500/20">
                Live Console
              </span>
              <p className="text-zinc-500 text-xs font-mono">Synced: {lastRefreshed.toLocaleTimeString()}</p>
            </div>
            <h2 className="text-4xl font-black tracking-tighter">Control Center</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden lg:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search infrastructure..." 
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all w-64 dark:text-white"
                />
             </div>
             <button className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-700 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-900" />
             </button>
             <button onClick={handleSync} disabled={devicesLoading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40">
                <RefreshCcw className={`w-4 h-4 ${devicesLoading ? 'animate-spin' : ''}`} />
                Sync
             </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          <section className="lg:col-span-1 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/50 dark:bg-zinc-950/80 backdrop-blur-md py-2 z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Infrastructure</h3>
              </div>
              <button onClick={() => setIsOnboardingOpen(true)} className="text-blue-500 hover:text-blue-400 p-1 bg-blue-500/10 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {devicesLoading ? (
               <div className="flex flex-col gap-4">
                 <CardSkeleton />
                 <CardSkeleton />
               </div>
            ) : devices.length > 0 ? (
              devices.map(device => (
                <DeviceCard 
                  key={device._id || device.deviceId} 
                  device={device} 
                  isSelected={selectedDevice?.deviceId === device.deviceId}
                  onSelect={setSelectedDevice}
                />
              ))
            ) : (
              <EmptyState 
                icon={Cpu} 
                title="Awaiting Devices" 
                message="Connect devices to view fleet telemetry." 
                actionText="Add Device"
                onAction={() => setIsOnboardingOpen(true)}
              />
            )}
          </section>

          <section className="lg:col-span-2 space-y-8">
            {selectedDevice ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 min-h-full">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all group shadow-sm">
                    <div className="bg-blue-50 dark:bg-blue-600/20 p-3 rounded-xl border border-blue-500/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-600/30 transition-all text-blue-500 dark:text-blue-400">
                       <Layout className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Node</p>
                      <h4 className="text-xl font-bold tracking-tighter truncate max-w-[120px]">{selectedDevice.name}</h4>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all group shadow-sm">
                    <div className="bg-emerald-50 dark:bg-emerald-600/20 p-3 rounded-xl border border-emerald-500/10 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-600/30 transition-all text-emerald-500">
                       <Grid2X2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Points</p>
                      <h4 className="text-xl font-bold tracking-tighter">{telemetry.length}</h4>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-all group shadow-sm">
                    <div className="bg-purple-50 dark:bg-purple-600/20 p-3 rounded-xl border border-purple-500/10 group-hover:bg-purple-100 dark:group-hover:bg-purple-600/30 transition-all text-purple-500">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Protocol</p>
                      <h4 className="text-xl font-bold tracking-tighter">MQTT/Sec</h4>
                    </div>
                  </div>
                </div>

                {selectedDevice.status === 'offline' ? (
                  <div className="h-[400px]">
                    <EmptyState 
                      icon={Power}
                      title="Device Offline"
                      message="This device is currently powered off. Connections to the telemetry stream are paused."
                      actionText="Power On"
                      onAction={async () => {
                        const { sendCommand } = useDeviceStore.getState();
                        await sendCommand(selectedDevice.deviceId, 'POWER_ON');
                      }}
                    />
                  </div>
                ) : isTelemetryLoading && telemetry.length === 0 ? (
                   <ChartSkeleton />
                ) : telemetry.length === 0 ? (
                  <div className="h-64">
                    <EmptyState 
                      icon={LineChartIcon}
                      title="No telemetry stream"
                      message="This device hasn't broadcasted any data metrics to the ingest servers recently."
                    />
                  </div>
                ) : (
                  <div className="grid gap-8">
                    <TelemetryChart 
                      data={telemetry} 
                      title="Thermal Monitor" 
                      dataKey="temperature" 
                      color="#3b82f6" 
                    />
                    <div className="grid md:grid-cols-2 gap-8">
                      <TelemetryChart 
                        data={telemetry} 
                        title="Humidity Index" 
                        dataKey="humidity" 
                        color="#10b981" 
                      />
                      <TelemetryChart 
                        data={telemetry} 
                        title="Voltage Vector" 
                        dataKey="voltage" 
                        color="#8b5cf6" 
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full">
                <EmptyState 
                  icon={LineChartIcon}
                  title="Initialize Monitoring"
                  message="Select an active node from the left panel to begin streaming high-fidelity visualization graphs."
                />
              </div>
            )}
          </section>
        </div>

        {isOnboardingOpen && (
          <OnboardingModal 
            onClose={() => setIsOnboardingOpen(false)} 
            onComplete={() => {
              fetchDevices();
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
