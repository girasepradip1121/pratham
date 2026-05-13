import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async ({ email, password }) => {
    // Simple mock validation: accept any non‑empty fields
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const mockUser = { email, name: 'Demo User' };
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const signup = async ({ name, email, password, phone }) => {
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required');
    }
    const newUser = { name, email, phone };
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
