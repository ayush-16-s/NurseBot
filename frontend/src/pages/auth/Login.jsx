










import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../services/Api.service";
 
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
 
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    setLoading(true);
    const { error: loginError } = await ApiService.login(formData);
    setLoading(false);

    if (loginError) {
      toast.error("Invalid email or password");
      setError(true);
      setTimeout(() => setError(false), 500);
      return;
    }

    toast.success("Welcome back!");
    setTimeout(() => navigate("/default"), 600);
  };

  return (
    <div className="login-professional">
      <div className="login-container">
        <div className={`login-card ${error ? "shake" : ""}`}>
          {/* NurseBot Logo */}
          <div className="logo-section">
            <div className="logo-icon">🏥</div>
            <h1 className="logo-text">🤖NurseBot</h1>
            <p className="logo-subtitle">Professional Healthcare Management</p>
          </div>

          {/* Welcome Message */}
          <div className="welcome-section">
            <h2>Welcome Back</h2>
            <p>Sign in to access your medical dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-btn ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <span className="loading-text">
                  <span className="spinner"></span>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="login-options">
            <p className="register-link">
              New to NurseBot? <Link to="/register">Create Account</Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="security-badge">
            <span className="security-icon">🔐</span>
            <span>Secured with 256-bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
