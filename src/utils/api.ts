
import { getCache, setCache } from './redisCache';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  
  return data;
};

// API client
export const api = {
  // Auth endpoints
  auth: {
    register: async (userData: FormData | object) => {
      const isFormData = userData instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: isFormData ? userData : JSON.stringify(userData),
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    brokerLogin: async (email: string, password: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, role: 'broker' }),
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        // Allow broker to login even if account is pending
        if (error instanceof Error && error.message.includes('pending approval')) {
          return { pendingApproval: true, message: error.message };
        }
        throw error;
      }
    },
    
    adminLogin: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'admin' }),
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    checkAuth: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    getCurrentUser: () => {
      // Get user from localStorage
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
    
    updatePassword: async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
  },
  
  // User endpoints
  user: {
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    updateProfile: async (userData: FormData | object) => {
      const isFormData = userData instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        body: isFormData ? userData : JSON.stringify(userData),
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    getFavorites: async () => {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        method: 'GET',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    addFavorite: async (apartmentId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${apartmentId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    removeFavorite: async (apartmentId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${apartmentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    savePreferences: async (preferences: object) => {
      const response = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    getPreferences: async () => {
      const response = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: 'GET',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
  },
  
  // Apartment endpoints
  apartments: {
    getAll: async (filters: object = {}) => {
      // Convert filters to query string
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/apartments?${params.toString()}`, {
        method: 'GET',
      });
      
      return handleResponse(response);
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
        method: 'GET',
      });
      
      return handleResponse(response);
    },
    
    search: async (query: string) => {
      const response = await fetch(`${API_BASE_URL}/apartments/search?q=${query}`, {
        method: 'GET',
      });
      
      return handleResponse(response);
    },
  },
  
  // Broker endpoints
  broker: {
    getListings: async () => {
      const response = await fetch(`${API_BASE_URL}/broker/listings`, {
        method: 'GET',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    createListing: async (listingData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/apartments`, {
        method: 'POST',
        body: listingData,
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    updateListing: async (id: string, listingData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
        method: 'PUT',
        body: listingData,
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    deleteListing: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      return handleResponse(response);
    },
    
    getBrokerStats: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/stats`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching broker stats:', error);
        return {
          activeListings: 0,
          totalInquiries: 0,
          profileViews: 0,
          responseRate: 0,
        };
      }
    },
    
    getBrokerSettings: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/settings`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching broker settings:', error);
        return {
          notifications: {
            newInquiries: true,
            listingUpdates: true,
            clientMessages: true,
            platformUpdates: false,
            weeklyReport: true,
          },
          listing: {
            showExactAddress: false,
            allowDirectContact: true,
            defaultAvailability: 'immediate',
            defaultLeaseTerms: '12months',
          },
          privacy: {
            showCompanyInfo: true,
            showProfilePhoto: true,
          },
          preferredContact: 'email',
          displayPhone: false,
          displayEmail: true,
        };
      }
    },
    
    updateBrokerSettings: async (settings: object) => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error updating broker settings:', error);
        throw error;
      }
    },
    
    getInquiries: async (status = 'all') => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/inquiries?status=${status}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        return [];
      }
    },
    
    respondToInquiry: async (inquiryId: string, response: string) => {
      try {
        const apiResponse = await fetch(`${API_BASE_URL}/broker/inquiries/${inquiryId}/respond`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ response }),
          credentials: 'include',
        });
        
        return handleResponse(apiResponse);
      } catch (error) {
        console.error('Error responding to inquiry:', error);
        throw error;
      }
    },
  },
  
  // Admin endpoints
  admin: {
    getAllUsers: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Return mock data for development
        return [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2023-01-15', lastActive: '2023-04-10' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2023-02-20', lastActive: '2023-04-12' },
          { id: '3', name: 'Michael Brown', email: 'michael@realestate.com', role: 'broker', createdAt: '2023-03-05', lastActive: '2023-04-09' },
          { id: '4', name: 'Sarah Johnson', email: 'sarah@realestate.com', role: 'broker', createdAt: '2023-03-10', lastActive: '2023-04-11' },
          { id: '5', name: 'Admin User', email: 'admin@aptmatchbuddy.com', role: 'admin', createdAt: '2023-01-01', lastActive: '2023-04-13' },
        ];
      }
    },
    
    getAllBrokers: async (status = 'all') => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker?status=${status}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching brokers:', error);
        // Return mock data for development
        return [
          { 
            id: '1', 
            name: 'Michael Brown', 
            email: 'michael@homefinders.com', 
            createdAt: '2023-03-01',
            brokerVerification: { 
              status: 'pending', 
              companyName: 'Home Finders', 
              licenseNumber: 'BRK123456', 
              submittedAt: '2023-03-01' 
            } 
          },
          { 
            id: '2', 
            name: 'Sarah Johnson', 
            email: 'sarah@luxuryestates.com', 
            createdAt: '2023-02-15',
            brokerVerification: { 
              status: 'approved', 
              companyName: 'Luxury Estates', 
              licenseNumber: 'BRK789012', 
              submittedAt: '2023-02-15',
              reviewedAt: '2023-02-17' 
            } 
          },
          { 
            id: '3', 
            name: 'James Davis', 
            email: 'james@cityliving.com', 
            createdAt: '2023-03-10',
            brokerVerification: { 
              status: 'rejected', 
              companyName: 'City Living', 
              licenseNumber: 'BRK345678', 
              submittedAt: '2023-03-10',
              reviewedAt: '2023-03-12',
              rejectionReason: 'Invalid license documentation' 
            } 
          },
        ];
      }
    },
    
    getAllListings: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/listings`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Return mock data for development
        return [
          { 
            id: '1', 
            title: 'Modern Downtown Apartment', 
            location: 'Downtown', 
            price: 1500, 
            status: 'active',
            broker: { name: 'Sarah Johnson', email: 'sarah@luxuryestates.com' } 
          },
          { 
            id: '2', 
            title: 'Cozy Studio in West End', 
            location: 'West End', 
            price: 1200, 
            status: 'pending',
            broker: { name: 'Michael Brown', email: 'michael@homefinders.com' } 
          },
          { 
            id: '3', 
            title: 'Spacious 2BR near Park', 
            location: 'North Side', 
            price: 1800, 
            status: 'rejected',
            broker: { name: 'James Davis', email: 'james@cityliving.com' } 
          },
        ];
      }
    },
    
    approveBroker: async (brokerId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/approve/${brokerId}`, {
          method: 'PUT',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error approving broker:', error);
        // Mock success for development
        return { message: 'Broker approved successfully' };
      }
    },
    
    rejectBroker: async (brokerId: string, reason: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/reject/${brokerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error rejecting broker:', error);
        // Mock success for development
        return { message: 'Broker application rejected' };
      }
    },
    
    revokeBroker: async (brokerId: string, reason: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/broker/revoke/${brokerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error revoking broker privileges:', error);
        // Mock success for development
        return { message: 'Broker privileges revoked' };
      }
    },
    
    approveListing: async (listingId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/listings/${listingId}/approve`, {
          method: 'PUT',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error approving listing:', error);
        // Mock success for development
        return { message: 'Listing approved successfully' };
      }
    },
    
    rejectListing: async (listingId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/listings/${listingId}/reject`, {
          method: 'PUT',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error rejecting listing:', error);
        // Mock success for development
        return { message: 'Listing rejected successfully' };
      }
    },
    
    getAdminStats: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Return mock data for development
        return {
          userCount: 156,
          brokerCount: 24,
          apartmentCount: 87,
          pendingBrokers: 5,
          pendingListings: 12,
        };
      }
    },
    
    getSystemSettings: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/settings`, {
          method: 'GET',
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error fetching system settings:', error);
        // Return mock data for development
        return {
          notifications: {
            newBrokerApplications: true,
            listingApprovals: true,
            userReports: true,
            weeklyStats: true
          },
          security: {
            twoFactorEnabled: false,
            autoLogout: true,
            loginHistory: [
              { device: 'Chrome on Windows', location: 'New York, USA', time: '2023-04-10T15:30:00Z' },
              { device: 'Firefox on MacOS', location: 'New York, USA', time: '2023-04-09T10:15:00Z' },
              { device: 'Safari on iPhone', location: 'Boston, USA', time: '2023-04-08T18:45:00Z' }
            ]
          },
          system: {
            enableUserRegistration: true,
            enableBrokerRegistration: true,
            requireEmailVerification: false,
            senderEmail: 'noreply@aptmatchbuddy.com'
          }
        };
      }
    },
    
    updateSystemSettings: async (settings: object) => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
          credentials: 'include',
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error updating system settings:', error);
        // Mock success for development
        return { message: 'Settings updated successfully' };
      }
    },
  },
  
  // AI explanation endpoints with Redis caching
  ai: {
    getExplanation: async (apartmentId: string, preferences: object) => {
      try {
        // Check if explanation exists in Redis cache
        const cacheKey = `explanation_${apartmentId}`;
        const cachedExplanation = await getCache(cacheKey);
        
        if (cachedExplanation) {
          console.log('Retrieved explanation from cache');
          return cachedExplanation;
        }
        
        // If not cached, get from API
        const response = await fetch(`${API_BASE_URL}/ai/explain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apartmentId,
            preferences
          }),
        });
        
        const explanation = await handleResponse(response);
        
        // Cache the explanation
        await setCache(cacheKey, explanation);
        
        return explanation;
      } catch (error) {
        console.error('Error getting AI explanation:', error);
        return {
          score: "0",
          breakdown: ["Error generating explanation"]
        };
      }
    }
  }
};
