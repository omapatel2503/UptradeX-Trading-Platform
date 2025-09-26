const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://3.208.13.185:8080',
  APP_NAME: process.env.REACT_APP_APP_NAME || 'Zerodha Dashboard',
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://3.208.13.185',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

export default config;
