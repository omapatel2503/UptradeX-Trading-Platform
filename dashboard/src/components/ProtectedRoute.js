import React, { useEffect, useState } from "react";
import config from "../config/config";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      // Check URL parameters first (for cross-domain auth)
      const urlParams = new URLSearchParams(window.location.search);
      const authParam = urlParams.get('auth');
      
      if (authParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(authParam));
          console.log('Auth data from URL:', userData);
          
          if (userData.isAuthenticated) {
            // Store in localStorage for this domain
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            
            // Clean up URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing auth parameter:', error);
        }
      }
      
      // Check localStorage
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedUserData = localStorage.getItem('userData');
      
      if (storedAuth && storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          if (parsedUserData.isAuthenticated) {
            console.log('User authenticated via localStorage');
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
      
      // Not authenticated
      console.log('User not authenticated, redirecting to login...');
      window.location.href = `${config.FRONTEND_URL}/login`;
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
