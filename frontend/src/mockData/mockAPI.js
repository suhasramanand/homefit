import axios from 'axios';

// Mock users for static deployment
const mockUsers = [
  {
    _id: 'mock-admin-1',
    email: 'admin@homefit.com',
    password: 'admin123',
    fullName: 'Admin User',
    type: 'admin',
    isApproved: true
  },
  {
    _id: 'mock-user-1',
    email: 'user@test.com',
    password: 'password123',
    fullName: 'Test User',
    type: 'user',
    isApproved: true
  },
  {
    _id: 'mock-broker-1',
    email: 'broker@test.com',
    password: 'password123',
    fullName: 'Test Broker',
    type: 'broker',
    isApproved: true
  },
  {
    _id: 'mock-broker-pending',
    email: 'pending@broker.com',
    password: 'password123',
    fullName: 'Pending Broker',
    type: 'broker',
    isApproved: false
  }
];

// Store mock session in localStorage
const getMockSession = () => {
  const session = localStorage.getItem('mockSession');
  return session ? JSON.parse(session) : null;
};

const setMockSession = (user) => {
  localStorage.setItem('mockSession', JSON.stringify(user));
};

const clearMockSession = () => {
  localStorage.removeItem('mockSession');
};

// Mock API interceptor for static deployment
export default function setupMockAPI(axiosInstance) {
  // Intercept requests
  const originalRequest = axiosInstance.request.bind(axiosInstance);
  
  axiosInstance.request = async function(config) {
    // Mock login
    if (config.url && (config.url.includes('/user/login') || config.url === '/api/user/login')) {
      const { email, password } = config.data || {};
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userData = {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          type: user.type,
          isApproved: user.isApproved
        };
        setMockSession(userData);
        
        return {
          data: {
            message: 'Login successful',
            user: userData
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        };
      } else {
        const error = new Error('Invalid email or password');
        error.response = {
          status: 401,
          data: { error: 'Invalid email or password' }
        };
        throw error;
      }
    }
    
    // Mock session check
    if (config.url && (config.url.includes('/user/session') || config.url === '/api/user/session')) {
      const session = getMockSession();
      if (session) {
        return {
          data: { user: session },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        };
      } else {
        const error = new Error('No active session');
        error.response = {
          status: 401,
          data: { error: 'No active session' }
        };
        throw error;
      }
    }
    
    // Mock logout
    if (config.url && (config.url.includes('/user/logout') || config.url === '/api/user/logout')) {
      clearMockSession();
      return {
        data: { message: 'Logout successful' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }
    
    // Mock broker/me endpoint
    if (config.url && (config.url.includes('/broker/me') || config.url === '/api/broker/me')) {
      const session = getMockSession();
      if (session && session.type === 'broker') {
        return {
          data: {
            ...session,
            phone: '+1 (555) 123-4567',
            licenseNumber: 'BRK-12345'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        };
      }
      const error = new Error('Not a broker');
      error.response = { status: 403, data: { error: 'Forbidden' } };
      throw error;
    }
    
    // For other requests, try to make actual request but handle gracefully
    try {
      return await originalRequest(config);
    } catch (err) {
      // If request fails and we're in mock mode, return empty data
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        console.warn('Mock mode: Request failed, returning empty data:', config.url);
        return {
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        };
      }
      throw err;
    }
  };
}

