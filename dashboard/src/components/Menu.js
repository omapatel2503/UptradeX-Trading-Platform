import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../config/config";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (index, path) => {
    setSelectedMenu(index);
    navigate(path);
  }

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  }

  const handleLogout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    window.location.href = `${config.FRONTEND_URL}/login`;
  }

  const menuClass = "nav-menu-item";
  const activeMenuClass = "nav-menu-item active";

  return (
    <div className="navbar-container">
      {/* Logo */}
      <div className="navbar-logo">
        <img src="logo.svg" alt="UptradeX" className="logo-img" />
      </div>

      {/* Navigation Menu */}
      <nav className="navbar-nav">
        <ul className="nav-menu">
          <li>
            <span 
              className={selectedMenu === 0 ? activeMenuClass : menuClass}
              onClick={() => handleMenuClick(0, "/dashboard")}
            >
              Dashboard
            </span>
          </li>
          <li>
            <span 
              className={selectedMenu === 1 ? activeMenuClass : menuClass}
              onClick={() => handleMenuClick(1, "/dashboard/orders")}
            >
              Orders
            </span>
          </li>
          <li>
            <span 
              className={selectedMenu === 2 ? activeMenuClass : menuClass}
              onClick={() => handleMenuClick(2, "/dashboard/holdings")}
            >
              Holdings
            </span>
          </li>
          <li>
            <span 
              className={selectedMenu === 3 ? activeMenuClass : menuClass}
              onClick={() => handleMenuClick(3, "/dashboard/positions")}
            >
              Positions
            </span>
          </li>
          <li>
            <span 
              className={selectedMenu === 4 ? activeMenuClass : menuClass}
              onClick={() => handleMenuClick(4, "/dashboard/funds")}
            >
              Funds
            </span>
          </li>
          <li>
            <span 
              className={selectedMenu === 5 ? activeMenuClass : menuClass}
              onClick={() => handleMenuClick(5, "/dashboard/apps")}
            >
              Apps
            </span>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="navbar-user">
        <div className="user-profile" onClick={handleProfileClick}>
          <div className="user-avatar">ZU</div>
          <span className="user-name">USERID</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Menu;
