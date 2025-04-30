import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://book-xplorer.onrender.com/api/auth/signup', { // Change to your actual sign-up endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign-up successful:', data);
        localStorage.setItem('authToken', data.token);
        setUser(data.user);  

        navigate('/home');  
      } else {
        console.error('Sign-up failed:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Something went wrong during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('https://book-xplorer.onrender.com/api/auth/update', {  
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ email, password }),  
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Profile updated successfully:', data);
        alert('Profile updated successfully!');
        setUser(data.user);  
      } else {
        console.error('Profile update failed:', data.message);
        alert(data.message);  
      }
    } catch (error) {
      console.error('Error during profile update:', error);
      alert('Something went wrong during the update.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='total'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} className="form-container">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? 'input-error' : ''}
            />
            <span onClick={togglePasswordVisibility} className="password-toggle">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      {user && (
        <div className="profile-update-container">
          <h3>Update Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>New Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password:</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      
      <p>Already have an account? <Link to="/Login">Login</Link></p>
    </div>
  );
};

export default SignUp;
