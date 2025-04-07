import { toast } from "@/components/ui/use-toast";
import { groqApi } from "./groqApi";

const API_URL = 'http://localhost:5000/api';

// Create request header
const headers = () => ({
  'Content-Type': 'application/json',
  credentials: 'include'
});

// Handle response and errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Show error toast
const handleError = (error: Error) => {
  console.error('API Error:', error);
  toast({
    title: 'Error',
    description: error.message || 'An unexpected error occurred',
    variant: 'destructive',
  });
  
  // Return null so the caller can still handle the error gracefully
  return null;
};

// API functions
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await handleResponse(response);
        
        // Store user in localStorage for UI purposes
        if (data.user) {
          localStorage.setItem('aptmatchbuddy_user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    register: async (userData: FormData | { name: string, email: string, password: string, role?: string }) => {
      try {
        let response;
        
        if (userData instanceof FormData) {
          // If FormData is provided (for broker registration with files)
          const role = userData.get('role');
          
          if (role === 'broker') {
            response = await fetch(`${API_URL}/auth/register/broker`, {
              method: 'POST',
              credentials: 'include',
              body: userData,
            });
          } else {
            response = await fetch(`${API_URL}/auth/register`, {
              method: 'POST',
              credentials: 'include',
              body: userData,
            });
          }
        } else {
          // Regular registration
          response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
        }
        
        const data = await handleResponse(response);
        
        // Store user in localStorage for UI purposes
        if (data.user) {
          localStorage.setItem('aptmatchbuddy_user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    logout: async () => {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        localStorage.removeItem('aptmatchbuddy_user');
      } catch (error: any) {
        handleError(error);
      }
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem('aptmatchbuddy_user');
      return user ? JSON.parse(user) : null;
    },
    
    checkAuth: async () => {
      try {
        const response = await fetch(`${API_URL}/auth/check`, {
          credentials: 'include'
        });
        const data = await handleResponse(response);
        
        if (data.isAuthenticated && data.user) {
          localStorage.setItem('aptmatchbuddy_user', JSON.stringify(data.user));
          return data.user;
        }
        
        localStorage.removeItem('aptmatchbuddy_user');
        return null;
      } catch (error: any) {
        localStorage.removeItem('aptmatchbuddy_user');
        return null;
      }
    },
    
    isAuthenticated: () => {
      return !!localStorage.getItem('aptmatchbuddy_user');
    },
    
    getRole: () => {
      const user = localStorage.getItem('aptmatchbuddy_user');
      return user ? JSON.parse(user).role : null;
    }
  },
  
  // Apartments endpoints
  apartments: {
    getAll: async (filters?: any) => {
      try {
        let url = `${API_URL}/apartments`;
        
        // Add query parameters if filters provided
        if (filters) {
          const params = new URLSearchParams();
          
          if (filters.minPrice) params.append('minPrice', filters.minPrice);
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
          if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
          if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);
          if (filters.location) params.append('location', filters.location);
          if (filters.amenities) params.append('amenities', filters.amenities.join(','));
          if (filters.available !== undefined) params.append('available', filters.available);
          
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    getById: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/apartments/${id}`);
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    create: async (apartmentData: FormData) => {
      try {
        const response = await fetch(`${API_URL}/apartments`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${getToken()}` },
          body: apartmentData, // FormData for file uploads
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    update: async (id: string, apartmentData: any) => {
      try {
        const response = await fetch(`${API_URL}/apartments/${id}`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify(apartmentData),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/apartments/${id}`, {
          method: 'DELETE',
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    }
  },
  
  // User endpoints
  user: {
    getProfile: async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    updateProfile: async (profileData: FormData | any) => {
      try {
        let response;
        
        if (profileData instanceof FormData) {
          response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            credentials: 'include',
            body: profileData,
          });
        } else {
          response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
          });
        }
        
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    addFavorite: async (apartmentId: string) => {
      try {
        const response = await fetch(`${API_URL}/users/favorites/${apartmentId}`, {
          method: 'POST',
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    removeFavorite: async (apartmentId: string) => {
      try {
        const response = await fetch(`${API_URL}/users/favorites/${apartmentId}`, {
          method: 'DELETE',
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    getFavorites: async () => {
      try {
        const response = await fetch(`${API_URL}/users/favorites`, {
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    updatePreferences: async (preferences: any) => {
      try {
        const response = await fetch(`${API_URL}/users/preferences`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify(preferences),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    getPreferences: async () => {
      try {
        const response = await fetch(`${API_URL}/users/preferences`, {
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    }
  },
  
  // Broker endpoints
  broker: {
    getListings: async () => {
      try {
        const response = await fetch(`${API_URL}/brokers/listings`, {
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    getProfile: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/brokers/${id}`);
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    }
  },
  
  // Admin endpoints
  admin: {
    getAllBrokers: async (status?: string) => {
      try {
        let url = `${API_URL}/brokers`;
        
        if (status && status !== 'all') {
          url += `?status=${status}`;
        }
        
        const response = await fetch(url, {
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    getAllUsers: async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    approveBroker: async (userId: string) => {
      try {
        const response = await fetch(`${API_URL}/brokers/approve/${userId}`, {
          method: 'PUT',
          headers: headers(),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    rejectBroker: async (userId: string, reason: string) => {
      try {
        const response = await fetch(`${API_URL}/brokers/reject/${userId}`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify({ reason }),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    revokeBroker: async (userId: string, reason: string) => {
      try {
        const response = await fetch(`${API_URL}/brokers/revoke/${userId}`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify({ reason }),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    }
  },
  
  // Groq AI integration
  groq: {
    getExplanation: async (prompt: string): Promise<string> => {
      try {
        // First try to use the backend API if available
        try {
          const response = await fetch(`${API_URL}/ai/explain`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ prompt }),
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.explanation;
          }
        } catch (err) {
          console.log('Backend AI service unavailable, falling back to client-side');
        }
        
        // Fallback to client-side implementation
        return await groqApi.getCompletion(prompt);
      } catch (error: any) {
        console.error('Error getting AI explanation:', error);
        return '';
      }
    }
  }
};

// Helper to get the stored token
const getToken = () => localStorage.getItem('aptmatchbuddy_token');

export default api;
