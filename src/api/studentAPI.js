import client from './client';

export function submitAnswers(examId, answersObj) {
  return client.post(`/exams/${examId}/submit`, { answers: answersObj });
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