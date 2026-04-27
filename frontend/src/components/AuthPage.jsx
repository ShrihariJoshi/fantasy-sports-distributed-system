import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login, register } from '../api';
import './AuthPage.css';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        await register(formData.username, formData.password);
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
          setFormData({ username: '', password: '' });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <div className="logo-placeholder">
            <div className="logo-circle"></div>
            <div className="logo-circle accent"></div>
          </div>
          <h2>{isLogin ? 'Welcome back' : 'Join the League'}</h2>
          <p className="subtitle">
            {isLogin
              ? 'Enter your details to sign in'
              : 'Create an account to start playing'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="message-box error"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="message-box success"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} style={{marginLeft: '8px'}} /></>
            )}
          </button>
        </form>

        <div className="toggle-mode">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="toggle-btn" onClick={toggleMode}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;