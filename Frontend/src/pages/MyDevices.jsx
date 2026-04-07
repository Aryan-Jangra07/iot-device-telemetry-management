import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DeviceCard from '../components/DeviceCard';
import { CardSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import OnboardingModal from '../components/OnboardingModal';
import useDeviceStore from '../store/deviceStore';
import { Cpu, Search, Plus, ServerCrash } from 'lucide-react';

const MyDevices = () => {
  const { devices, isLoading, error, fetchDevices } = useDeviceStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const filteredDevices = devices.filter(d => 
    (d?.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (d?.deviceId?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                Inventory
              </span>
            </div>
            <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">My Devices</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40"
          >
             <Plus className="w-5 h-5" />
             Register New
          </button>
        </header>

        <div className="mb-8 relative z-10">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or device ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Handling Async UX States */}
        {error ? (
          <div className="h-96">
            <EmptyState 
              icon={ServerCrash} 
              title="Connection Error" 
              message={error} 
              actionText="Retry Connection" 
              onAction={fetchDevices} 
            />
          </div>
        ) : isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
             <CardSkeleton />
             <CardSkeleton />
             <CardSkeleton />
          </div>
        ) : devices.length === 0 ? (
          <div className="h-[400px]">
            <EmptyState 
              icon={Cpu} 
              title="No devices connected" 
              message="Your infrastructure is currently empty. Get started by registering your first IoT device and viewing its live telemetry stream." 
              actionText="Add Device" 
              onAction={() => setIsModalOpen(true)} 
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredDevices.map(device => (
              <DeviceCard 
                key={device._id || device.deviceId} 
                device={device} 
                isSelected={false}
                onSelect={() => {}} 
              />
            ))}
            {filteredDevices.length === 0 && (
              <div className="col-span-full py-20 bg-white dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center">
                 <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                 <p className="text-zinc-500 font-medium">No devices match your search query.</p>
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <OnboardingModal 
            onClose={() => setIsModalOpen(false)} 
            onComplete={fetchDevices}
          />
        )}
      </main>
    </div>
  );
};

export default MyDevices;
