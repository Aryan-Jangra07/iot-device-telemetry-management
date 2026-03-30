import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  Settings, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { logoutUser, getUser } from '../utils/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Cpu, label: 'My Devices', path: '/devices' },
    { icon: Zap, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 rounded-lg p-2 shadow-lg shadow-blue-900/40">
          <Zap className="text-white w-6 h-6 fill-current" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">IoT Cloud</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              location.pathname === item.path
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-slate-950/50 border border-slate-800 mb-4">
          <div className="bg-slate-800 p-2 rounded-lg">
            <UserIcon className="text-slate-400 w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className={`w-3 h-3 ${user?.role === 'admin' ? 'text-blue-400' : 'text-slate-500'}`} />
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
