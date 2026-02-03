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
  // Intercept all requests
  axiosInstance.interceptors.request.use((config) => {
    // Mock login
    if (config.url && (config.url.includes('/user/login') || config.url === '/api/user/login' || config.url.endsWith('/user/login'))) {
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
        
        // Return a rejected promise that will be caught by response interceptor
        return Promise.reject({
          isMock: true,
          mockResponse: {
            data: {
              message: 'Login successful',
              user: userData
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          }
        });
      } else {
        return Promise.reject({
          isMock: true,
          mockResponse: {
            data: { error: 'Invalid email or password' },
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config
          }
        });
      }
    }
    
    // Mock session check
    if (config.url && (config.url.includes('/user/session') || config.url === '/api/user/session' || config.url.endsWith('/user/session'))) {
      const session = getMockSession();
      if (session) {
        return Promise.reject({
          isMock: true,
          mockResponse: {
            data: { user: session },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          }
        });
      } else {
        return Promise.reject({
          isMock: true,
          mockResponse: {
            data: { error: 'No active session' },
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config
          }
        });
      }
    }
    
    // Mock logout
    if (config.url && (config.url.includes('/user/logout') || config.url === '/api/user/logout' || config.url.endsWith('/user/logout'))) {
      clearMockSession();
      return Promise.reject({
        isMock: true,
        mockResponse: {
          data: { message: 'Logout successful' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
      });
    }
    
    // Mock broker/me endpoint
    if (config.url && (config.url.includes('/broker/me') || config.url === '/api/broker/me' || config.url.endsWith('/broker/me'))) {
      const session = getMockSession();
      if (session && session.type === 'broker') {
        return Promise.reject({
          isMock: true,
          mockResponse: {
            data: {
              ...session,
              phone: '+1 (555) 123-4567',
              licenseNumber: 'BRK-12345'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          }
        });
      }
      return Promise.reject({
        isMock: true,
        mockResponse: {
          data: { error: 'Forbidden' },
          status: 403,
          statusText: 'Forbidden',
          headers: {},
          config
        }
      });
    }
    
    return config;
  });

  // Handle mock responses
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If it's a mock response, convert it to a successful response
      if (error.isMock && error.mockResponse) {
        if (error.mockResponse.status === 200) {
          return Promise.resolve(error.mockResponse);
        } else {
          // For non-200 status, create an error with response
          const axiosError = new Error(error.mockResponse.data.error || 'Request failed');
          axiosError.response = error.mockResponse;
          return Promise.reject(axiosError);
        }
      }
      
      // For other errors in mock mode, return empty data
      if (import.meta.env.VITE_USE_MOCK === 'true' && !error.response) {
        console.warn('Mock mode: Request failed, returning empty data:', error.config?.url);
        return Promise.resolve({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        });
      }
      
      return Promise.reject(error);
    }
  );
}

