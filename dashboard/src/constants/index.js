// API endpoints
export const API_ENDPOINTS = {
  HOLDINGS: '/allHoldings',
  POSITIONS: '/allPositions',
  ORDERS: '/allOrders',
  NEW_ORDER: '/newOrder',
  STOCK: '/api/stock',
  WATCHLIST: '/api/watchlist',
  INDICES: '/api/indices',
};

// Stock symbols
export const STOCK_SYMBOLS = {
  NIFTY_50: '^NSEI',
  SENSEX: '^BSESN',
  NSE_SUFFIX: '.NS',
};

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  STOCK_DATA: 5000, // 5 seconds
  INDICES: 5000,    // 5 seconds
  HOLDINGS: 5000,   // 5 seconds
};

// UI constants
export const UI_CONSTANTS = {
  MAX_WATCHLIST_ITEMS: 50,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_DATA: 'Invalid data provided.',
  TIMEOUT: 'Request timeout. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  DATA_UPDATED: 'Data updated successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
};

export default {
  API_ENDPOINTS,
  STOCK_SYMBOLS,
  REFRESH_INTERVALS,
  UI_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
