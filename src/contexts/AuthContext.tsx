
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { animations } from '@/utils/animations';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'broker' | 'admin';
  avatar?: string;
  brokerVerification?: {
    status: 'pending' | 'approved' | 'rejected';
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: FormData | { name: string, email: string, password: string, role?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: FormData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const currentUser = await api.auth.checkAuth();
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
        
        // Add entrance animation for the app when auth is loaded
        const body = document.body;
        animations.fadeIn(body, 0.2, 0.5);
      }
    };
    
    checkAuthentication();
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await api.auth.login(email, password);
      if (data && data.user) {
        setUser(data.user);
        toast({
          title: "Welcome back!",
          description: `You've successfully logged in as ${data.user.name}`,
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: FormData | { name: string, email: string, password: string, role?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await api.auth.register(userData);
      if (data && data.user) {
        // For regular users, set user. For brokers, don't set user since they need approval
        if (data.user.role !== 'broker' || (data.user.brokerVerification && data.user.brokerVerification.status === 'approved')) {
          setUser(data.user);
        }
        
        toast({
          title: "Account created!",
          description: data.user.role === 'broker' 
            ? "Your broker account has been submitted for approval. You'll receive an email when approved."
            : "Your account has been successfully created.",
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (profileData: FormData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await api.user.updateProfile(profileData);
      if (data && data.user) {
        setUser(prev => prev ? { ...prev, ...data.user } : data.user);
        toast({
          title: "Profile updated!",
          description: "Your profile has been successfully updated.",
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
