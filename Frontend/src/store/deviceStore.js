import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUser } from '../utils/auth';

// Configure standard axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor for JWT token
api.interceptors.request.use((config) => {
  const user = getUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

const useDeviceStore = create((set, get) => ({
  devices: [],
  isLoading: false,
  error: null,
  
  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/devices');
      set({ devices: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch devices', 
        isLoading: false 
      });
      toast.error('Could not load devices');
    }
  },

  sendCommand: async (deviceId, command, payload = {}) => {
    // Optimistic UI state tracking
    set((state) => ({
      devices: state.devices.map(d => 
        d.deviceId === deviceId ? { ...d, isProcessing: true } : d
      )
    }));
    
    try {
      await api.post(`/devices/${deviceId}/command`, { command, payload });
      toast.success(`Command "${command}" sent successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to send "${command}"`);
      throw error; // Re-throw to inform components
    } finally {
      // Revert processing state
      set((state) => ({
        devices: state.devices.map(d => 
          d.deviceId === deviceId ? { ...d, isProcessing: false } : d
        )
      }));
    }
  },

  deleteDevice: async (deviceId) => {
    try {
      await api.delete(`/devices/${deviceId}`);
      set((state) => ({
        devices: state.devices.filter(d => d.deviceId !== deviceId)
      }));
      toast.success('Device removed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove device');
      throw error;
    }
  },
  
  registerDevice: async (name, config = {}) => {
    try {
      const res = await api.post('/devices/register', { name, config });
      // Reload logic slightly to not fake too much data (DB populates defaults)
      await get().fetchDevices(); 
      toast.success('Device registered!');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register device');
      throw error;
    }
  }
}));

export default useDeviceStore;
export { api };
