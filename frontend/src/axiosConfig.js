import axios from 'axios';
import mockAPI, { getMockSession } from './mockData/mockAPI';

// Check if we're in static/mock mode (for Vercel deployment)
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK === 'true' || 
                     (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL);

// Configure default axios
if (!USE_MOCK_API) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  axios.defaults.withCredentials = true;
}

const instance = axios.create({
  baseURL: USE_MOCK_API ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:4000/api'),
  withCredentials: !USE_MOCK_API,
});

// Helper function to handle mock API calls
const handleMockRequest = async (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const data = config.data || {};
  const params = config.params || {};
  
  try {
    let response;
    
    // Auth endpoints
    if (url.includes('/user/login') && method === 'post') {
      response = await mockAPI.login(data.email, data.password);
    } else if (url.includes('/user/signup') && method === 'post') {
      response = await mockAPI.signup(data);
    } else if (url.includes('/user/logout') && method === 'post') {
      response = await mockAPI.logout();
    } else if (url.includes('/user/session') && method === 'get') {
      response = await mockAPI.getSession();
    }
    // User profile
    else if (url.includes('/user/profile') && method === 'get') {
      response = await mockAPI.getUserProfile();
    } else if (url.includes('/user/profile') && method === 'put') {
      response = await mockAPI.updateUserProfile(data);
    }
    // Apartments
    else if ((url.includes('/apartments') || url.includes('/apartment')) && method === 'get') {
      if (url.includes('/apartments/') || url.includes('/apartment/')) {
        const id = url.split('/').pop();
        response = await mockAPI.getApartment(id);
      } else {
        response = await mockAPI.getApartments(params);
      }
    } else if ((url.includes('/apartments') || url.includes('/apartment')) && method === 'post') {
      // Return success for apartment creation in mock mode
      response = { message: 'Apartment created successfully', apartment: data };
    }
    // Preferences
    else if (url.includes('/user/preferences') || url.includes('/preferences')) {
      if (method === 'get') {
        response = await mockAPI.getUserPreference();
      } else if (method === 'post' || method === 'put') {
        response = await mockAPI.savePreference(data);
      }
    }
    // Matches
    else if (url.includes('/user/matches') || url.includes('/matches')) {
      response = await mockAPI.getMatches();
    }
    // Saved apartments
    else if (url.includes('/saved-apartments') || url.includes('/saved')) {
      if (method === 'get') {
        response = await mockAPI.getSavedApartments();
      } else if (method === 'post' && url.includes('save')) {
        response = await mockAPI.saveApartment(data.apartmentId);
      } else if (method === 'post' && url.includes('unsave')) {
        response = await mockAPI.unsaveApartment(data.apartmentId);
      }
    }
    // Broker endpoints
    else if (url.includes('/broker/me')) {
      response = await mockAPI.getBrokerProfile();
    } else if (url.includes('/broker/listings')) {
      response = await mockAPI.getBrokerListings();
    } else if (url.includes('/broker/stats') || url.includes('/broker/dashboard')) {
      response = await mockAPI.getBrokerStats();
    }
    // Admin endpoints
    else if (url.includes('/admin/stats') || url.includes('/admin/dashboard')) {
      response = await mockAPI.getAdminStats();
    } else if (url.includes('/admin/users')) {
      response = await mockAPI.getAllUsers();
    } else if (url.includes('/admin/brokers')) {
      response = await mockAPI.getAllBrokers();
    }
    // Inquiries
    else if (url.includes('/contact-broker') || url.includes('/inquiry')) {
      response = await mockAPI.contactBroker(data);
    } else if (url.includes('/inquiries')) {
      response = await mockAPI.getInquiries();
    }
    // Tours
    else if (url.includes('/tours')) {
      if (method === 'post') {
        response = await mockAPI.scheduleTour(data);
      } else if (method === 'get' && url.includes('user')) {
        response = await mockAPI.getUserTours();
      }
    }
    // System
    else if (url.includes('/system/maintenance-status') || url.includes('/maintenance')) {
      response = await mockAPI.getMaintenanceStatus();
    }
    // Default
    else {
      console.warn('Mock API: Unknown endpoint', method.toUpperCase(), url);
      response = { data: null, message: 'Mock endpoint not implemented' };
    }
    
    return {
      data: response,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

// Intercept requests if using mock API - intercept on default axios instance
if (USE_MOCK_API) {
  // Intercept on default axios instance (for components using axios directly)
  axios.interceptors.request.use(
    async (config) => {
      // If URL matches our API pattern, use mock
      const url = (config.url || '').toString();
      if (url.includes('/api/') || url.includes('localhost:4000') || !url.startsWith('http')) {
        // This is an API call - intercept it
        const mockResponse = await handleMockRequest(config);
        // Throw a special error that we'll catch in response interceptor
        const mockError = new Error('MOCK_API_REQUEST');
        mockError.config = config;
        mockError.mockResponse = mockResponse;
        throw mockError;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Catch mock responses
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.message === 'MOCK_API_REQUEST' && error.mockResponse) {
        return Promise.resolve(error.mockResponse);
      }
      return Promise.reject(error);
    }
  );

  // Also intercept on instance
  instance.interceptors.request.use(
    async (config) => {
      const mockResponse = await handleMockRequest(config);
      const mockError = new Error('MOCK_API_REQUEST');
      mockError.config = config;
      mockError.mockResponse = mockResponse;
      throw mockError;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.message === 'MOCK_API_REQUEST' && error.mockResponse) {
        return Promise.resolve(error.mockResponse);
      }
      return Promise.reject(error);
    }
  );
}

export default instance;
