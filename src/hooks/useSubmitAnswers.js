import { useState } from 'react';
import client from '../api/client';

export const useSubmitAnswers = (examId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (answers) => {
    try {
      setLoading(true);
      setError(null);
      await client.post(`/exams/${examId}/submit`, { answers });
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Cevaplar kaydedilirken bir hata oluştu.');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}; 