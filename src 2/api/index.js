// src/api/index.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.39:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor: Authorization header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: 401 olursa logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Burada navigation ile Login sayfasına yönlendirme ekleyebilirsiniz
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('Login attempt with credentials:', credentials);
      
      // API'nin beklediği formatta veri hazırla
      const loginData = {
        email: credentials.email.trim(),
        password: credentials.password
      };
      
      console.log('Sending login request with data:', loginData);
      const response = await api.post('/login', loginData);
      console.log('Login response:', response.data);

      if (response.data.token) {
        // Token'ı AsyncStorage'a kaydet
        await AsyncStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);

        // Kullanıcı bilgilerini AsyncStorage'a kaydet
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('User data stored:', response.data.user);
        }

        // API instance'ının header'ını güncelle
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        return { 
          success: true, 
          data: response.data 
        };
      }

      return { 
        success: false, 
        error: 'Token alınamadı' 
      };
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });

      if (error.response?.status === 401) {
        throw new Error('E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.');
      }

      throw new Error(error.response?.data?.message || 'Giriş yapılamadı');
    }
  },
  register: async (userData) => {
    try {
      console.log('Register attempt with data:', userData);
      const response = await api.post('/register', userData);
      console.log('Register response:', response.data);
      
      // API yanıtını kontrol et
      if (response.data) {
        // Token varsa sakla
        if (response.data.token) {
          await AsyncStorage.setItem('token', response.data.token);
          console.log('Token stored:', response.data.token);
        }
        
        // Kullanıcı bilgileri varsa sakla
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('User data stored:', response.data.user);
        }
        
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Kayıt işlemi başarısız'
      };
    } catch (error) {
      console.error('Register error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 422) {
        // Validation error handling
        const validationErrors = error.response.data.errors || {};
        const errorMessage = Object.values(validationErrors).flat().join('\n');
        throw new Error(errorMessage || 'Kayıt bilgileri geçersiz');
      }
      
      throw new Error(error.response?.data?.message || 'Kayıt işlemi başarısız');
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  },
  resetPassword: async (data) => {
    try {
      const response = await api.post('/reset-password', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  },
  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Oturum bulunamadı');
      const response = await api.get('/user');
      const user = response.data.user;
      if (!user) throw new Error('Kullanıcı bilgileri alınamadı');
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, data: user };
    } catch (error) {
      console.error('Get user error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        throw new Error('Oturum süresi dolmuş, lütfen tekrar giriş yapın');
      }
      throw new Error(error.response?.data?.message || 'Kullanıcı bilgileri alınamadı');
    }
  },
  logout: async () => {
    try {
      await api.post('/logout');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }
};

export const profileAPI = {
  update: async (userData) => {
    try {
      const response = await api.post('/profile/update', userData);
      if (response.data) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
      }
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  },
  changePassword: async (passwords) => {
    try {
      const response = await api.post('/password/update', passwords);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  },
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.post('/notifications/settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update notification settings error:', error);
      return { success: false, error: error.message };
    }
  },
  updateLanguagePreference: async (language) => {
    try {
      const response = await api.post('/preferences/language', { language });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update language preference error:', error);
      return { success: false, error: error.message };
    }
  }
};

export const examAPI = {
  getExams: async () => {
    try {
      const response = await api.get('/exams');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get exams error:', error);
      return { success: false, error: error.message };
    }
  },
  getExam: async (id) => {
    try {
      const response = await api.get(`/exams/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get exam error:', error);
      return { success: false, error: error.message };
    }
  },
  submitExam: async (examId, answers) => {
    try {
      const response = await api.post(`/exams/${examId}/submit`, { answers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Submit exam error:', error);
      return { success: false, error: error.message };
    }
  },
  getResults: async () => {
    try {
      const response = await api.get('/exam-results');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get exam results error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default api;
