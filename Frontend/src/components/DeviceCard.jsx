import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { deviceService } from '../services/api';

const DeviceCard = ({ device, onSelect, isSelected, onDelete }) => {
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    setLoading(true);
    try {
      await deviceService.sendCommand(device.deviceId, command.toUpperCase());
      setStatus({ type: 'success', message: 'Command sent' });
      setCommand('');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send' });
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-300 border rounded-2xl ${
        isSelected 
        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20' 
        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-colors ${
              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                {device?.name || 'Unknown Device'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono text-blue-400 border border-slate-800 tracking-tighter">
                  ID: {device?.deviceId || 'N/A'}
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    device.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'
                  }`} />
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${
                    device.status === 'online' ? 'text-emerald-500' : 'text-slate-500'
                  }`}>
                    {device.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to remove this device?')) {
                  onDelete(device.deviceId);
                }
              }}
              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onSelect(device)}
              className={`p-2 rounded-lg transition-all ${
                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-950/50 border border-slate-800/50 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Last Sync</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-500/50" />
              <span className="text-sm font-medium">Recently</span>
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800/50 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Telemetry</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-blue-500/50" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>

        <div className="relative pt-4 border-t border-slate-800">
          <form onSubmit={handleSendCommand} className="flex gap-2">
            <div className="relative flex-1 group">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="CMD: RELAY_ON"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/40"
            >
              <Send className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </form>

          {status && (
            <div className={`absolute -bottom-1 left-0 right-0 transform translate-y-full px-2 py-1 flex items-center gap-1.5 transition-all animate-in fade-in slide-in-from-top-2`}>
              {status.type === 'success' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-[10px] font-bold uppercase ${
                status.type === 'success' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {status.message}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
