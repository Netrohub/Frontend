import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, api } from '@/lib/api';
import type { User } from '@/types/api';
import { IS_PRODUCTION } from '@/config/env';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = api.getToken();
    if (token) {
      refreshUser().catch(() => {
        // If refresh fails, clear token
        api.setToken(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const data = await authApi.getUser();
      setUser(data);
    } catch (error) {
      setUser(null);
      api.setToken(null);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    api.setToken(response.token);
    setUser(response.user);
  };

  const register = async (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) => {
    const response = await authApi.register(data);
    api.setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      if (!IS_PRODUCTION) {
        console.error('Logout error:', error);
      }
    } finally {
      api.setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

