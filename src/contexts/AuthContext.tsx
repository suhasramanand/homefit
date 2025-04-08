
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/utils/api';
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: object | FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored token and validate on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Updated to use checkAuth instead of validate
          const userData = await api.auth.checkAuth();
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user, token } = await api.auth.login(email, password);
      localStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const { user, token } = await api.auth.register(userData);
      localStorage.setItem('token', token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };
  
  const updateUserProfile = async (userData: object | FormData) => {
    setIsLoading(true);
    try {
      const updatedUser = await api.user.updateProfile(userData);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
