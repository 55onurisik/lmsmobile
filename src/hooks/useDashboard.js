import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export const useDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await client.get('/dashboard');
      console.log('Dashboard response:', response.data);
      
      if (response.data.status === 'success') {
        setExams(response.data.data);
      } else {
        throw new Error(response.data.message || 'Veri alınamadı');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Sınavlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const refreshExams = useCallback(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refreshExams };
}; 