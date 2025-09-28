import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { api } from '@/lib/api';
import { User } from '@shared/types';
export function AppLayout() {
  const { isAuthenticated, token, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else {
      const fetchUser = async () => {
        try {
          const userData = await api.get<User>('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data, logging out.', error);
          logout();
        }
      };
      fetchUser();
    }
  }, [isAuthenticated, navigate, token, setUser, logout]);
  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50/50 dark:bg-gray-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}