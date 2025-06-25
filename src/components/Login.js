import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log('Login successful:', data);
      const token = data.token;
      const nationality = data.nationality;
      const playWithAnotherLanguage = data.playWithAnotherLanguage;
      localStorage.setItem('token', token);
      localStorage.setItem('observer', 'false');
      localStorage.setItem('username', username);
      localStorage.setItem('isChill', true);
      localStorage.setItem('nationality', nationality);
      localStorage.setItem('playWithAnotherLanguage', playWithAnotherLanguage);
      navigate('/auction');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleObserverEntry = () => {
    localStorage.setItem('observer', 'true');
    localStorage.removeItem('username')
    localStorage.removeItem('token');
    localStorage.removeItem('isChill');
    localStorage.removeItem('nationality');
    navigate('/auction');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Login"
          className="login-input"
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit" className="login-button">Join</button>
        <button type="button" className="observer-button" onClick={handleObserverEntry}>Observer</button>
      </form>
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/calamity_logo_1.png`} alt="Calamity Logo" className="logo" />
      </div>
    </div>
  );
};

export default Login;
