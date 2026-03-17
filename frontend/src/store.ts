import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('auth_token'),
  username: localStorage.getItem('username'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  
  login: (token: string, username: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('username', username);
    set({ token, username, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    set({ token: null, username: null, isAuthenticated: false });
  },
}));
