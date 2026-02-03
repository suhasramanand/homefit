import axios from 'axios';
import mockAPI from './mockData/mockAPI';

const instance = axios.create({
  baseURL: import.meta.env.VITE_USE_MOCK === 'true' 
    ? '/api' // Use relative path for static deployment
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'),
  withCredentials: true,
});

// Set up mock API if using mock data
if (import.meta.env.VITE_USE_MOCK === 'true') {
  mockAPI(instance);
}

export default instance;
