import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Bilgisayarınızın IP adresini buraya yazın
const API_URL = 'http://192.168.1.41:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 saniye timeout
  validateStatus: function (status) {
    return status >= 200 && status < 500; // 500'den küçük tüm status kodlarını kabul et
  }
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    if (error.response) {
      console.log('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.log('API Request Error:', error.request);
    } else {
      console.log('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    try {
      console.log('Register attempt with:', userData);
      const response = await api.post('/register', userData);
      console.log('Register response:', response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.log('Register Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.log('Login Error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      await AsyncStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.log('Logout Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.log('Get User Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api; 