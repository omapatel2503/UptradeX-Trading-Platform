const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://3.208.13.185:8080',
  APP_NAME: process.env.REACT_APP_APP_NAME || 'Zerodha Frontend',
  DASHBOARD_URL: process.env.REACT_APP_DASHBOARD_URL || 'http://3.208.13.185:3000',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

export default config;
