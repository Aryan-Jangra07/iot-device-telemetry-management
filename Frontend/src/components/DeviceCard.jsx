import React, { useState } from 'react';
import { 
  Cpu, Activity, Terminal, Send, CheckCircle2, AlertCircle, Clock,
  ChevronRight, Trash2, Power
} from 'lucide-react';
import useDeviceStore from '../store/deviceStore';
import Tooltip from './Tooltip';

const DeviceCard = ({ device, onSelect, isSelected }) => {
  const [command, setCommand] = useState('');
  const [isOn, setIsOn] = useState(false); // Optimistic local toggle state
  const { sendCommand, deleteDevice } = useDeviceStore();

  const handleSendCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    try {
      await sendCommand(device.deviceId, command.toUpperCase());
      setCommand('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    const targetState = !isOn;
    setIsOn(targetState); // Optimistic UI
    try {
      await sendCommand(device.deviceId, targetState ? 'POWER_ON' : 'POWER_OFF');
    } catch {
      setIsOn(!targetState); // Revert on fail
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this device?')) {
      await deleteDevice(device.deviceId);
    }
  };

  const isProcessing = device.isProcessing || false;

  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-300 border rounded-2xl ${
        isSelected 
        ? 'bg-blue-50 dark:bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20' 
        : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
      }`}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
            <div className={`p-2.5 rounded-xl transition-all duration-300 shrink-0 ${
              isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate">
                {device?.name || 'Unknown Device'}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded text-[10px] font-mono text-blue-500 dark:text-blue-400 border border-zinc-200 dark:border-zinc-800 tracking-tighter truncate max-w-full">
                  ID: {device?.deviceId || 'N/A'}
                </span>
                <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 hidden sm:block" />
                <div className="flex items-center gap-1 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${
                    device.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'
                  }`} />
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${
                    device.status === 'online' ? 'text-emerald-500' : 'text-zinc-500'
                  }`}>
                    {device.status || 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls Right Header */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start shrink-0">
            <Tooltip content={isOn ? 'Power Off' : 'Power On'}>
              <button 
                onClick={handleToggle}
                disabled={isProcessing}
                className={`p-2.5 rounded-xl transition-all duration-300 border flex items-center justify-center ${
                  isOn 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20' 
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Power className="w-4 h-4" />
              </button>
            </Tooltip>
            
            <Tooltip content="Delete Device">
              <button 
                onClick={handleDelete}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip>
            
            <button 
              onClick={() => onSelect(device)}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center border ${
                isSelected 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30' 
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 border-transparent hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:text-blue-600 hover:border-blue-500/30'
              }`}
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">Last Sync</p>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-blue-500/50" />
              <span className="text-sm font-medium">Just Now</span>
            </div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">Telemetry</p>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-emerald-500/50" />
              <span className="text-sm font-medium">Live Stream</span>
            </div>
          </div>
        </div>

        <div className="relative pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <form onSubmit={handleSendCommand} className="flex gap-2">
            <div className="relative flex-1 group">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="CMD: RESTART"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all uppercase font-mono disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing || !command.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/40"
            >
              <Send className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
