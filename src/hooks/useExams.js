import { useState, useCallback, useEffect } from 'react';
import client from '../api/client';

export const useExams = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get('/exams');
      setExams(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Sınavlar yüklenirken bir hata oluştu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return {
    exams,
    loading,
    error,
    refetch: fetchExams
  };
}; 