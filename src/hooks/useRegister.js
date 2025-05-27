import { useState } from 'react';
import { register } from '../api/studentAPI';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(formData);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
} 