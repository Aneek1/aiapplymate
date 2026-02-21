import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '@/services/api';
import type { User, UserStats } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  stats: UserStats | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data!.user);
          
          // Load stats
          try {
            const statsResponse = await userAPI.getStats();
            setStats(statsResponse.data!);
          } catch (e) {
            console.log('Stats not available');
          }
        } catch (error: any) {
          // Token invalid, clear it
          localStorage.removeItem('token');
          setError(error.message || 'Session expired');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const response = await authAPI.login({ email, password });
    const { user, token } = response.data!;
    
    localStorage.setItem('token', token);
    setUser(user);
    
    // Load stats
    try {
      const statsResponse = await userAPI.getStats();
      setStats(statsResponse.data!);
    } catch (e) {
      console.log('Stats not available');
    }
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setError(null);
    const response = await authAPI.register(userData);
    const { user, token } = response.data!;
    
    localStorage.setItem('token', token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setStats(null);
    setError(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    const response = await authAPI.updateProfile(updates);
    setUser(response.data!.user);
  }, []);

  const refreshStats = useCallback(async () => {
    if (!user) return;
    try {
      const response = await userAPI.getStats();
      setStats(response.data!);
    } catch (e) {
      console.log('Stats refresh failed');
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    stats,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshStats,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
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
