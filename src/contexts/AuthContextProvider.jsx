import React, { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import apiClient from '../apis/axiosClient';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const refreshPromiseRef = useRef(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ User loaded from localStorage:', parsedUser);
        } catch (error) {
          console.error('❌ Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      } else {
        console.log('ℹ️ No saved user found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error accessing localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    queryClient.setQueryData(['user'], userData);
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    setUser(null);
    setIsRefreshing(false);
    localStorage.removeItem('user');
    queryClient.setQueryData(['user'], null);
    queryClient.removeQueries(['user']);
    queryClient.clear();
  };

  // Refresh token function
  const refreshToken = async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    if (!user) {
      console.log('ℹ️ No user to refresh token for');
      return Promise.resolve();
    }

    setIsRefreshing(true);
    console.log('🔄 Attempting to refresh token...');

    refreshPromiseRef.current = apiClient.post("/api/auth/refresh")
      .then((response) => {
        console.log('✅ Token refreshed successfully');
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
        return response.data;
      })
      .catch((error) => {
        console.error('❌ Token refresh failed:', error);
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
        
        // If refresh fails, logout the user
        logout();
        throw error;
      });

    return refreshPromiseRef.current;
  };

  // Listen for global logout events (e.g., from axios interceptors)
  useEffect(() => {
    const onLogout = () => { logout(); };
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', onLogout);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:logout', onLogout);
      }
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized,
    isRefreshing,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
