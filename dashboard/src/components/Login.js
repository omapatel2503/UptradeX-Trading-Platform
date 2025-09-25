import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    try {
      // Here you would typically send the data to your backend for authentication
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">Login</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
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
              <label htmlFor="password">Password:</label>
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
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link></p>
          </div>
        </div>
      </div>
      
      <div className="login-footer-section">
        <div className="footer-content">
          <div className="footer-left">
            <div className="zerodha-logo">
              <div className="logo-icon"></div>
              <span className="logo-text">ZERODHA</span>
            </div>
            <p className="copyright">© 2010 - 2025, Zerodha Broking Ltd. All rights reserved.</p>
          </div>
          
          <div className="footer-columns">
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#referral">Referral program</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press & media</a></li>
                <li><a href="#csr">Zerodha Cares (CSR)</a></li>
                <li><a href="#technology">Technology</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#support">Support portal</a></li>
                <li><a href="#blog">Z-Connect blog</a></li>
                <li><a href="#charges">List of charges</a></li>
                <li><a href="#downloads">Downloads & resources</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Account</h4>
              <ul>
                <li><a href="#open-account">Open an account</a></li>
                <li><a href="#fund-transfer">Fund transfer</a></li>
                <li><a href="#challenge">60 day challenge</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-legal">
          <div className="legal-content">
            <p>
              Zerodha Broking Ltd.: Member of NSE, BSE & MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: 
              Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Commodity 
              Trading through Zerodha Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238 
              Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, 
              J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities 
              broking please write to <a href="mailto:complaints@zerodha.com">complaints@zerodha.com</a>, for DP 
              related to <a href="mailto:dp@zerodha.com">dp@zerodha.com</a>. Please ensure you carefully read the 
              Risk Disclosure Document as prescribed by SEBI | ICF
            </p>
            
            <p>
              Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing 
              complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, 
              Speedy redressal of the grievances
            </p>
            
            <p>
              Smart Online Dispute Resolution | Grievances Redressal Mechanism
            </p>
            
            <p>
              Investments in securities market are subject to market risks; read all the related documents carefully before investing.
            </p>
            
            <div className="attention-investors">
              <h5>Attention investors</h5>
              <ol>
                <li>Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020.</li>
                <li>Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge.</li>
                <li>Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.</li>
              </ol>
            </div>
            
            <p>
              "Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. 
              Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. 
              Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is 
              done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process 
              again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need 
              to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank 
              to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. 
              As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find 
              anyone claiming to be part of Zerodha and offering such services, please create a ticket here.
            </p>
          </div>
          
          <div className="footer-links">
            <a href="#nse">NSE</a>
            <a href="#bse">BSE</a>
            <a href="#mcx">MCX</a>
            <a href="#terms">Terms & conditions</a>
            <a href="#policies">Policies & procedures</a>
            <a href="#privacy">Privacy policy</a>
            <a href="#disclosure">Disclosure</a>
            <a href="#investor-attention">For investor's attention</a>
            <a href="#investor-charter">Investor charter</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
