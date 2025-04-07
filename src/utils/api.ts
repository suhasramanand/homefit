
import { toast } from "@/components/ui/use-toast";

const API_URL = 'http://localhost:5000/api';

// Helper to get the stored token
const getToken = () => localStorage.getItem('aptmatchbuddy_token');

// Create request header with auth token
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await handleResponse(response);
        
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('aptmatchbuddy_token', data.token);
          localStorage.setItem('aptmatchbuddy_user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    register: async (userData: { name: string, email: string, password: string, role?: string }) => {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const data = await handleResponse(response);
        
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('aptmatchbuddy_token', data.token);
          localStorage.setItem('aptmatchbuddy_user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (error: any) {
        return handleError(error);
      }
    },
    
    logout: () => {
      localStorage.removeItem('aptmatchbuddy_token');
      localStorage.removeItem('aptmatchbuddy_user');
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem('aptmatchbuddy_user');
      return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated: () => {
      return !!getToken();
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
    
    updateProfile: async (profileData: any) => {
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify(profileData),
        });
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
    },
    
    apply: async (applicationData: any) => {
      try {
        const response = await fetch(`${API_URL}/brokers/apply`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(applicationData),
        });
        return await handleResponse(response);
      } catch (error: any) {
        return handleError(error);
      }
    }
  },
  
  // Admin endpoints
  admin: {
    getAllBrokers: async () => {
      try {
        const response = await fetch(`${API_URL}/brokers`, {
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
    }
  }
};

export default api;
