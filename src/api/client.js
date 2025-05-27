import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the base URL from environment or use a default
const BASE_URL = 'https://69df-88-236-121-197.ngrok-free.app/api/studentAPI';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Making request to:', `${BASE_URL}${config.url}`);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status);
    return response;
  },
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Sunucuya bağlanırken zaman aşımı oluştu. Lütfen internet bağlantınızı kontrol edin.'));
    }

    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Sunucuya bağlanılamıyor. Lütfen:\n\n1. İnternet bağlantınızı kontrol edin\n2. Backend sunucunun çalıştığından emin olun\n3. ngrok URL\'inin doğru olduğunu kontrol edin'));
    }

    console.error('Response error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      // Chat endpoint'leri için token'ı silme
      const isChatEndpoint = error.config.url.includes('/chat');
      if (!isChatEndpoint) {
        console.log('Unauthorized, removing token');
        await AsyncStorage.removeItem('token');
      }
      return Promise.reject(new Error('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.'));
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error('İstenen kaynak bulunamadı.'));
    }

    if (error.response?.status === 500) {
      return Promise.reject(new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.'));
    }

    if (error.response?.status === 502) {
      return Promise.reject(new Error('Sunucuya bağlanılamıyor. Lütfen:\n\n1. Backend sunucunun çalıştığından emin olun\n2. ngrok URL\'inin doğru olduğunu kontrol edin\n3. Tekrar deneyin'));
    }

    return Promise.reject(error);
  }
);

export default client; 