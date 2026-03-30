import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DeviceCard from '../components/DeviceCard';
import { deviceService } from '../services/api';
import { Cpu, Search, Plus, Loader2 } from 'lucide-react';

const MyDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '' });
  const [registering, setRegistering] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await deviceService.getDevices();
      setDevices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch devices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!newDevice.name) return;
    
    setRegistering(true);
    try {
      await deviceService.registerDevice(newDevice.name);
      setIsModalOpen(false);
      setNewDevice({ name: '' });
      fetchDevices(); // Refresh list
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setRegistering(false);
    }
  };

  const filteredDevices = devices.filter(d => 
    (d?.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (d?.deviceId?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleDeleteDevice = async (deviceId) => {
    try {
      await deviceService.deleteDevice(deviceId);
      fetchDevices(); // Refresh list
    } catch (err) {
      alert('Failed to delete device: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                Inventory
              </span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">My Devices</h2>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or device ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Scanning Infrastructure...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredDevices.map(device => (
              <DeviceCard 
                key={device._id || device.deviceId} 
                device={device} 
                isSelected={false}
                onSelect={() => {}} 
                onDelete={handleDeleteDevice}
              />
            ))}
            {filteredDevices.length === 0 && (
              <div className="col-span-full py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl text-center">
                 <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                 <p className="text-slate-500 font-medium">No devices found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Register Device Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Register Device</h3>
              <p className="text-slate-400 mb-6 text-sm">Add a new IoT device to your account.</p>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Friendly Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Living Room Temp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={newDevice.name}
                    onChange={e => setNewDevice({...newDevice, name: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={registering}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                  >
                    {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDevices;
