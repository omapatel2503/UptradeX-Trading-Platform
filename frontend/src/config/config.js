const config = {
  DASHBOARD_URL: process.env.REACT_APP_DASHBOARD_URL || 'http://localhost:3000',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  APP_NAME: process.env.REACT_APP_APP_NAME || 'Zerodha Clone',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

export default config;
