import client from './client';

export function submitAnswers(examId, answersObj) {
  return client.post(`/exams/${examId}/submit`, { answers: answersObj });
} 