import { useState } from 'react';
import { submitAnswers } from '../api/studentAPI';

export const useSubmitAnswers = (examId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (answersArray) => {
    try {
      setLoading(true);
      setError(null);

      // Convert array format to object format
      const answersObj = answersArray.reduce((obj, item) => {
        obj[item.question_id] = item.selected_answer;
        return obj;
      }, {});

      console.log('Submitting answers:', answersObj);
      
      const response = await submitAnswers(examId, answersObj);
      console.log('Submit response:', response.data);

      if (response.data.status === 'success') {
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Cevaplar kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Cevaplar kaydedilirken bir hata oluştu.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}; 