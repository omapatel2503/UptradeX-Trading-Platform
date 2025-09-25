import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

function Login() {
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
            // Basic validation
            if (!formData.email || !formData.password) {
                throw new Error("Please fill in all fields");
            }

            if (!formData.email.includes('@')) {
                throw new Error("Please enter a valid email address");
            }

            // Simulate API call to backend
            console.log('Attempting login with:', { email: formData.email });
            
            // Simulate successful login
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Set authentication token with user info
            const userData = {
                email: formData.email,
                loginTime: new Date().toISOString(),
                isAuthenticated: true
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
            
            console.log('Login successful, redirecting to dashboard...');
            
            // Pass auth data via URL parameters for cross-domain authentication
            const authData = encodeURIComponent(JSON.stringify(userData));
            window.location.href = `${config.DASHBOARD_URL}/dashboard?auth=${authData}`;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title text-center mb-4">Login</h1>
                            
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form>
                            
                            <div className="text-center mt-3">
                                <p>Don't have an account? <a href="/signup" className="text-primary">Sign up here</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
