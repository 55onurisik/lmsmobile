import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function submitAnswers(examId, answersObj) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const payload = {
      exam_id: examId,
      answers: answersObj
    };

    console.log('API call - submitAnswers:', {
      url: `/exams/${examId}/submit`,
      payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const response = await client.post(`/exams/${examId}/submit`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('API response:', {
      status: response.status,
      data: response.data
    });

    return response;
  } catch (error) {
    console.error('API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

export function logout() {
  return client.post('/logout');
}

export function register(data) {
  return client.post('/register', data);
}

export function getReview(examId, broadcast = false) {
  console.log('Sending review request to:', `/exams/${examId}/review`);
  console.log('With params:', { broadcast: broadcast ? 'yes' : 'no' });
  
  return client.get(`/exams/${examId}/review`, {
    params: { broadcast: broadcast ? 'yes' : 'no' }
  });
} 