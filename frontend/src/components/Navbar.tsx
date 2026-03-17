import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Button, Input, Card } from './UI';
import { Mail, Lock, LogOut, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-400 hover:text-blue-300">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">🏏</div>
          FantasyCricket
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-slate-300">Welcome, <span className="font-semibold text-blue-400">{username}</span></span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  <Mail size={16} /> Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  <Lock size={16} /> Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
