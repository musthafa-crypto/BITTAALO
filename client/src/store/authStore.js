import { create } from 'zustand';
import api from '../utils/axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading: false,
    });
  },

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data.user) {
        get().setUser(res.data.user);
        return res.data.user;
      }
    } catch {
      set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
    }
    return null;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      get().setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data?.success) {
      get().setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout note:', e.message);
    }
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },

  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data?.success) {
      get().setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Failed to update profile');
  },
}));

// Listen for global auth failure from axios interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().setUser(null);
  });
}
