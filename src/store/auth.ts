import { create } from 'zustand';
import { User } from '@shared/types';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('plaza_ops_token'),
  isAuthenticated: !!localStorage.getItem('plaza_ops_token'),
  login: (token, user) => {
    localStorage.setItem('plaza_ops_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('plaza_ops_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));