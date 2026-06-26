import React, {
  createContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import API_BASE_URL from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('studentToken') || null
  );

  const [loading, setLoading] = useState(true);

  // =========================
  // LOGOUT
  // =========================
  const logout = useCallback(() => {
    localStorage.removeItem('studentToken');
    setToken(null);
    setUser(null);
  }, []);

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = useCallback(async (authToken) => {

    try {

      const res = await fetch(`${API_BASE_URL}/api/student/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        logout();
        return null;
      }

      const data = await res.json();

      setUser(data);

      return data;

    } catch (error) {

      console.error('Profile Fetch Error:', error);

      logout();

      return null;
    }

  }, [logout]);

  // =========================
  // RESTORE LOGIN
  // =========================
  useEffect(() => {

    const restoreSession = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      await fetchProfile(token);

      setLoading(false);
    };

    restoreSession();

  }, [token, fetchProfile]);

  // =========================
  // GOOGLE LOGIN
  // =========================
  const googleLogin = async (googleToken, googleProfile = null) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: googleToken,
          profile: googleProfile
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      localStorage.setItem('studentToken', data.token);
      setToken(data.token);
      const profile = await fetchProfile(data.token);
      return profile;
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = {
    user,
    token,
    loading,
    googleLogin,
    logout,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};