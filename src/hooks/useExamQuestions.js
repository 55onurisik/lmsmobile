import { useState, useEffect } from 'react';
import client from '../api/client';

export const useExamQuestions = (examId) => {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/exams/${examId}/answer`);
        setExam(response.data.exam);
        setQuestions(response.data.questions);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Sorular yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchQuestions();
    }
  }, [examId]);

  return { exam, questions, loading, error };
}; 