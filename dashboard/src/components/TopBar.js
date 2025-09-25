import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Menu from "./Menu";
import config from "../config/config";

const TopBar = () => {
  const [indices, setIndices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    // Clear any URL parameters and redirect
    window.location.href = `${config.FRONTEND_URL}/login`;
  };

  const fetchIndices = async () => {
    try {
      console.log('Fetching market indices...');
      const response = await axios.get(`${config.API_URL}/api/indices`);
      console.log('Received indices data:', response.data);
      setIndices(response.data);
    } catch (err) {
      console.error('Error fetching indices:', err);
      // Fallback to static values
      setIndices({
        nifty: { price: 100.2, percent: 0 },
        sensex: { price: 100.2, percent: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndices();
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchIndices, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return price ? price.toFixed(2) : '100.2';
  };

  const formatPercent = (percent) => {
    if (!percent) return '';
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getPercentClass = (percent) => {
    if (!percent) return '';
    return percent >= 0 ? 'up' : 'down';
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
                  <p className="index-points">
                    {formatPrice(indices.nifty?.price)}
                  </p>
          <p className={`percent ${getPercentClass(indices.nifty?.percent)}`}>
            {formatPercent(indices.nifty?.percent)}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
                  <p className="index-points">
                    {formatPrice(indices.sensex?.price)}
                  </p>
          <p className={`percent ${getPercentClass(indices.sensex?.percent)}`}>
            {formatPercent(indices.sensex?.percent)}
          </p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;

// Add this at the end of the component, before the closing div
<div className="timestamp">
  <p>Last Updated: {new Date().toLocaleTimeString()}</p>
</div>
