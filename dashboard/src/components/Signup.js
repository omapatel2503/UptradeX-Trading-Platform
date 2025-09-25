import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Account created successfully! Please login.");
      setFormData({ fullName: "", email: "", password: "" });
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Navbar />

      <div className="auth-main">
        <div className="auth-content">
          <div className="auth-left">
            <h1 className="auth-title">Open a free demat and trading account online</h1>
            <p className="auth-subtitle">Start investing brokerage free and join a community of 1.5+ crore investors and traders</p>
            
            <div className="auth-graphics">
              <div className="graphics-container">
                <div className="watchlist-mockup">
                  <div className="mockup-header">Market Overview</div>
                  <div className="indices-mockup">
                    <div className="index-item">
                      <span>NIFTY 50</span>
                      <span className="price">24,976.45</span>
                      <span className="change down">-0.32%</span>
                    </div>
                    <div className="index-item">
                      <span>SENSEX</span>
                      <span className="price">81,546.82</span>
                      <span className="change down">-0.21%</span>
                    </div>
                  </div>
                  <div className="stocks-list">
                    <div className="stock-item">
                      <span>RELIANCE</span>
                      <span className="price">2,112.40</span>
                      <span className="change up">+1.44%</span>
                    </div>
                    <div className="stock-item">
                      <span>TCS</span>
                      <span className="price">3,194.80</span>
                      <span className="change down">-0.25%</span>
                    </div>
                    <div className="stock-item">
                      <span>INFY</span>
                      <span className="price">1,555.45</span>
                      <span className="change down">-1.60%</span>
                    </div>
                  </div>
                </div>
                
                <div className="console-mockup">
                  <div className="mockup-header">Backoffice</div>
                  <div className="console-content">
                    <div className="user-info">Hi, Rainmatter</div>
                    <div className="equity-info">Equity 13.08L</div>
                    <div className="holdings-info">Holdings (138) 93.38k</div>
                    <div className="chart-placeholder">Market overview</div>
                  </div>
                </div>
                
                <div className="kite-card">
                  <div className="card-header">Kite</div>
                  <div className="card-content">Trade stocks for delivery or intraday on over 5000 stocks listed on NSE and BSE.</div>
                </div>
                
                <div className="coin-card">
                  <div className="card-header">Coin</div>
                  <div className="card-content">Direct Mutual funds in your demat</div>
                  <div className="mobile-mockup">
                    <div className="mobile-content">
                      <div>Hi Deepak</div>
                      <div className="mobile-stats">
                        <div>+47.9k</div>
                        <div>₹2.21L invested</div>
                        <div>₹3.45L current</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="signup-form-container">
              <h2 className="form-title">Signup Now</h2>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name :</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email :</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Create Password :</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="signup-btn"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Signup"}
                </button>
              </form>
              
              <div className="auth-footer">
                <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
