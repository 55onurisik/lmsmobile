import { useState, useEffect } from 'react';
import client from '../api/client';

export const useReview = (examId, broadcast = 'no') => {
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/exams/${examId}/review?broadcast=${broadcast}`);
        setExam(response.data.exam);
        setStudentAnswers(response.data.studentAnswers);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Değerlendirme yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchReview();
    }
  }, [examId, broadcast]);

  return { exam, studentAnswers, loading, error };
}; 