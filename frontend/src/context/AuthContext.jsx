import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from localStorage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('ansusirleaf_token');
    const savedUser = localStorage.getItem('ansusirleaf_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Helper: Request wrapper with authorization headers
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  };

  // Register User
  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ansusirleaf_token', data.token);
      localStorage.setItem('ansusirleaf_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login User
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ansusirleaf_token', data.token);
      localStorage.setItem('ansusirleaf_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout User
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ansusirleaf_token');
    localStorage.removeItem('ansusirleaf_user');
  };

  const isAdmin = user && user.role === 'admin';

  const value = {
    user,
    token,
    loading,
    error,
    isAdmin,
    register,
    login,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
