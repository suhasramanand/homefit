import axios from 'axios';
import mockAPI from './mockData/mockAPI';

const instance = axios.create({
  baseURL: process.env.REACT_APP_USE_MOCK === 'true' 
    ? '/api' // Use relative path for static deployment
    : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api'),
  withCredentials: true,
});

// Set up mock API if using mock data
if (process.env.REACT_APP_USE_MOCK === 'true') {
  mockAPI(instance);
}

export default instance;
