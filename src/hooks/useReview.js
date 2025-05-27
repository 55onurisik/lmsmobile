import { useState, useEffect } from 'react';
import { getReview } from '../api/studentAPI';

export function useReview(examId, broadcast = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentAnswers, setAnswers] = useState([]);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    async function fetchReview() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getReview(examId, broadcast);
        setAnswers(data.studentAnswers);
        setExam(data.exam);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReview();
  }, [examId, broadcast]);

  return { studentAnswers, exam, loading, error };
} 