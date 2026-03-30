import React from 'react';
import Sidebar from '../components/Sidebar';
import { getUser } from '../utils/auth';
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Database, 
  Bell, 
  Moon,
  Lock,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  const user = getUser();

  const sections = [
    {
      title: 'Profile Settings',
      icon: User,
      items: [
        { label: 'Email Address', value: user?.email, type: 'text' },
        { label: 'Account Role', value: user?.role, type: 'badge' },
      ]
    },
    {
      title: 'System Configuration',
      icon: Database,
      items: [
        { label: 'InfluxDB Status', value: 'Connected', type: 'status' },
        { label: 'MQTT Broker', value: 'ws://localhost:1883', type: 'text' },
      ]
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        { label: 'Password', value: '••••••••••••', type: 'button', btnLabel: 'Change' },
        { label: 'Two-Factor Auth', value: 'Disabled', type: 'button', btnLabel: 'Enable' },
      ]
    }
  ];

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        <header className="mb-10 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">
              User Preferences
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Settings</h2>
        </header>

        <div className="max-w-4xl space-y-8 relative z-10">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/30">
                <section.icon className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-300">{section.title}</h3>
              </div>
              <div className="p-8 space-y-6">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-slate-400 mb-1">{item.label}</p>
                      {item.type === 'badge' ? (
                        <span className="bg-blue-600/20 text-blue-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-blue-500/20">
                          {item.value}
                        </span>
                      ) : item.type === 'status' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-400 font-bold text-sm tracking-tight">{item.value}</span>
                        </div>
                      ) : (
                        <p className="text-white font-semibold">{item.value}</p>
                      )}
                    </div>
                    {item.type === 'button' && (
                      <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700">
                        {item.btnLabel}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Settings;
