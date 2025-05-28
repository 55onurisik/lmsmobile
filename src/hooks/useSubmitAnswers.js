import { useState } from 'react';
import { submitAnswers } from '../api/studentAPI';

export const useSubmitAnswers = (examId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (answersArray) => {
    try {
      setLoading(true);
      setError(null);

      if (!examId) {
        throw new Error('Sınav ID\'si bulunamadı.');
      }

      // Convert array format to object format
      const answersObj = answersArray.reduce((obj, item) => {
        obj[item.question_id] = item.selected_answer;
        return obj;
      }, {});

      // Build the payload
      const payload = {
        exam_id: examId,
        answers: answersObj
      };

      console.log('Submitting payload:', {
        examId,
        answersObj,
        fullPayload: payload
      });
      
      const response = await submitAnswers(examId, answersObj);
      
      console.log('Submit response:', {
        status: response.status,
        data: response.data
      });

      if (response.data.status === 'success') {
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Cevaplar kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Submit error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
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