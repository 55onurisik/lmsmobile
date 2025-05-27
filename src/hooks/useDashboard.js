import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export const useDashboard = () => {
  const [exams, setExams] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkExamStatus = async (examId) => {
    try {
      await client.get(`/exams/${examId}/answer`);
      return false; // Sınav çözülmemiş
    } catch (error) {
      if (error.response?.status === 403) {
        return true; // Sınav çözülmüş
      }
      return false;
    }
  };

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await client.get('/dashboard');
      
      if (response.data.status === 'success') {
        setStudent(response.data.data.student);
        
        // Her sınav için çözülüp çözülmediğini kontrol et
        const examsWithStatus = await Promise.all(
          response.data.data.exams.map(async (exam) => {
            try {
              const isCompleted = await checkExamStatus(exam.id);
              return {
                ...exam,
                is_completed: isCompleted
              };
            } catch (error) {
              // 403 hatasını görmezden gel
              if (error.response?.status === 403) {
                return {
                  ...exam,
                  is_completed: true
                };
              }
              return exam;
            }
          })
        );
        
        setExams(examsWithStatus);
      } else {
        throw new Error(response.data.message || 'Veri alınamadı');
      }
    } catch (err) {
      // 403 hatasını görmezden gel
      if (err.response?.status !== 403) {
        setError(err.response?.data?.message || 'Sınavlar yüklenirken bir hata oluştu.');
      }
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

  return { exams, student, loading, error, refreshExams };
}; 