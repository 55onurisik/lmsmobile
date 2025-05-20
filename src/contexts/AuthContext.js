import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth state from storage
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedStudent = await AsyncStorage.getItem('student');
        
        if (storedToken && storedStudent) {
          setToken(storedToken);
          setStudent(JSON.parse(storedStudent));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await client.post('/login', { email, password });
      const { student, token } = response.data.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('student', JSON.stringify(student));

      setStudent(student);
      setToken(token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu.',
      };
    }
  };

  const logout = async () => {
    try {
      await client.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('student');
      setStudent(null);
      setToken(null);
    }
  };

  const value = {
    student,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 