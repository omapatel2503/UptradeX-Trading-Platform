import axios from 'axios';
import config from '../config/config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      window.location.href = `${config.FRONTEND_URL}/login`;
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Holdings
  getHoldings: () => api.get('/allHoldings'),
  getPositions: () => api.get('/allPositions'),
  getOrders: () => api.get('/allOrders'),
  createOrder: (orderData) => api.post('/newOrder', orderData),

  // Stock data
  getStock: (symbol) => api.get(`/api/stock/${symbol}`),
  getWatchlist: (symbols) => api.post('/api/watchlist', { symbols }),
  getIndices: () => api.get('/api/indices'),
};

export default api;
