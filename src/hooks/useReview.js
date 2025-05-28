import { useState, useEffect } from 'react';
import { getReview } from '../api/studentAPI';
import client from '../api/client';

export function useReview(examId, broadcast = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentAnswers, setAnswers] = useState([]);
  const [exam, setExam] = useState(null);

  const formatImageUrl = (url) => {
    if (!url) {
      console.log('Image URL is null or undefined');
      return null;
    }
    // Eğer URL zaten tam URL ise, olduğu gibi döndür
    if (url.startsWith('http')) {
      console.log('URL is already absolute:', url);
      return url;
    }
    // Base URL'yi al ve direkt storage path'ini ekle
    const baseUrl = client.defaults.baseURL.replace('/api/studentAPI', '');
    const fullUrl = `${baseUrl}/storage/${url}`;
    console.log('Formatted image URL:', {
      original: url,
      baseUrl: baseUrl,
      fullUrl: fullUrl
    });
    return fullUrl;
  };

  const fetchReview = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching review for examId:', examId, 'broadcast:', broadcast);
      const { data } = await getReview(examId, broadcast);
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      // Resim URL'lerini formatla
      const formattedAnswers = data.studentAnswers.map(answer => {
        console.log('Processing answer:', {
          answerId: answer.answer_id,
          originalMedia: answer.review_media
        });
        return {
          ...answer,
          review_media: formatImageUrl(answer.review_media)
        };
      });
      
      console.log('Formatted answers:', JSON.stringify(formattedAnswers, null, 2));
      setAnswers(formattedAnswers);
      setExam(data.exam);
    } catch (err) {
      console.error('Error in fetchReview:', err);
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
      console.log('Checking review visibility for answerId:', answerId);
      const { data } = await getReview(examId, broadcast);
      console.log('Visibility check response:', JSON.stringify(data, null, 2));
      
      const updatedAnswer = data.studentAnswers.find(a => a.answer_id === answerId);
      if (updatedAnswer) {
        console.log('Found answer:', {
          answerId: updatedAnswer.answer_id,
          originalMedia: updatedAnswer.review_media
        });
        
        // Resim URL'sini formatla
        const formattedAnswer = {
          ...updatedAnswer,
          review_media: formatImageUrl(updatedAnswer.review_media)
        };
        
        console.log('Formatted answer:', JSON.stringify(formattedAnswer, null, 2));
        setAnswers(prev => 
          prev.map(a => a.answer_id === answerId ? formattedAnswer : a)
        );
        return true;
      }
      console.log('Answer not found for ID:', answerId);
      return false;
    } catch (err) {
      console.error('Error in checkReviewVisibility:', err);
      return false;
    }
  };

  return { studentAnswers, exam, loading, error, checkReviewVisibility, fetchReview };
} 