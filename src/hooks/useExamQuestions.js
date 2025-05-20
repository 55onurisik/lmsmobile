import { useState, useEffect } from 'react';
import client from '../api/client';

export const useExamQuestions = (examId) => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!examId) {
        setError('Sınav ID\'si bulunamadı.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching exam questions for examId:', examId);
        const response = await client.get(`/exams/${examId}/answer`);
        console.log('Exam response:', JSON.stringify(response.data, null, 2));

        if (!response.data) {
          throw new Error('API yanıtı boş geldi.');
        }

        // API yanıtı başarılı ise
        if (response.data.status === 'success') {
          const { exam: examData, questions } = response.data;
          
          // exam ve questions kontrolü
          if (!examData || !questions) {
            throw new Error('Sınav verisi eksik.');
          }

          setExam({
            ...examData,
            questions: questions.map(q => ({
              id: q.id,
              question_text: q.question_text || `Soru ${q.question_number}`,
              question_number: q.question_number,
              answer_text: q.answer_text
            }))
          });
        } else {
          throw new Error(response.data.message || 'Sorular yüklenirken bir hata oluştu.');
        }
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(err.message || 'Sorular yüklenirken bir hata oluştu.');
        setExam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  return { exam, loading, error };
}; 