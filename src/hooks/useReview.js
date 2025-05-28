import { useState, useEffect } from 'react';
import { getReview } from '../api/studentAPI';

export function useReview(examId, broadcast = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentAnswers, setAnswers] = useState([]);
  const [exam, setExam] = useState(null);

  const fetchReview = async () => {
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
  };

  useEffect(() => {
    fetchReview();
  }, [examId, broadcast]);

  const checkReviewVisibility = async (answerId) => {
    try {
      const { data } = await getReview(examId, broadcast);
      const updatedAnswer = data.studentAnswers.find(a => a.answer_id === answerId);
      if (updatedAnswer && updatedAnswer.review_visibility) {
        setAnswers(prev => 
          prev.map(a => a.answer_id === answerId ? updatedAnswer : a)
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking review visibility:', err);
      return false;
    }
  };

  return { studentAnswers, exam, loading, error, checkReviewVisibility, fetchReview };
} 