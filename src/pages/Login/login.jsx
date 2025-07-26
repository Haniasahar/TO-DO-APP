import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation (min 6 chars)
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validations
    if (isRegistering) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.phone.match(/^\d{10,15}$/)) {
        newErrors.phone = 'Invalid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/home'); // Redirect on success
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">
        <div className="toggle-buttons">
          <button 
            type="button"
            className={`toggle-btn ${!isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(false)}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`toggle-btn ${isRegistering ? 'active' : ''}`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {isRegistering && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className={`login-input ${errors.fullName ? 'error' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className={`login-input ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className={`login-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            required
            autoFocus
          />
          {errors.email && <span className="error-message">{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`login-input ${errors.password ? 'error' : ''}`}
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}

          <button type="submit" className="login-btn">
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;