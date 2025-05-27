import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as apiLogout } from '../api/studentAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Checking token:', token ? 'Token exists' : 'No token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Token kontrolü sırasında hata:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    try {
      console.log('Logging in with token...');
      await AsyncStorage.setItem('token', token);
      setIsAuthenticated(true);
      console.log('Login successful');
    } catch (error) {
      console.error('Token kaydedilirken hata:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 