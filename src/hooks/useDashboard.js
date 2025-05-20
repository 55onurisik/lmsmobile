import { useState, useEffect } from 'react';
import client from '../api/client';

export const useDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await client.get('/dashboard');
        setExams(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Sınavlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return { exams, loading, error };
}; 