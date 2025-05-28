import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { useReview } from '../hooks/useReview';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';
import { useFocusEffect } from '@react-navigation/native';

const ReviewScreen = ({ route, navigation }) => {
  const { examId, broadcast } = route.params;
  const { exam, studentAnswers, loading, error, checkReviewVisibility, fetchReview } = useReview(examId, broadcast);
  const { isAuthenticated } = useAuth();
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);

  const refreshData = useCallback(() => {
    if (isAuthenticated) {
      fetchReview();
    }
  }, [isAuthenticated]);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const toggleAnswer = async (answerId) => {
    const isVisible = await checkReviewVisibility(answerId);
    if (!isVisible) {
      // Eğer inceleme görünür değilse, genişletmeyi engelle
      return;
    }
    
    setExpandedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(answerId)) {
        newSet.delete(answerId);
      } else {
        newSet.add(answerId);
      }
      return newSet;
    });
  };

  const getAnswerStatus = (isCorrect) => {
    if (isCorrect === 2) return 'Boş';
    return isCorrect === 1 ? 'Doğru' : 'Yanlış';
  };

  const getAnswerStyle = (isCorrect) => {
    if (isCorrect === 2) return styles.emptyAnswer;
    return isCorrect === 1 ? styles.correctAnswer : styles.incorrectAnswer;
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorAlert 
      message={error.response?.data?.message || error.message || 'Değerlendirme yüklenirken bir hata oluştu.'} 
      onRetry={() => navigation.goBack()}
    />;
  }

  // Sort answers by question number
  const sortedAnswers = [...studentAnswers].sort((a, b) => {
    const aNum = parseInt(a.answer_id);
    const bNum = parseInt(b.answer_id);
    return aNum - bNum;
  });

  const toggleBroadcast = () => {
    navigation.setParams({
      broadcast: broadcast === 'yes' ? 'no' : 'yes',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sınav İnceleme</Text>
      </View>

      <ScrollView style={styles.content}>
        {sortedAnswers.map((answer, index) => (
          <View key={answer.answer_id} style={styles.answerContainer}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>
                {index + 1}. Soru
              </Text>
              <Text
                style={[
                  styles.answerStatus,
                  getAnswerStyle(answer.is_correct)
                ]}
              >
                {getAnswerStatus(answer.is_correct)}
              </Text>
            </View>

            <View style={styles.answerContent}>
              <Text style={styles.answerText}>
                Cevabınız: {answer.students_answer?.toUpperCase() || 'Boş'}
              </Text>
              
              <TouchableOpacity 
                style={styles.reviewButton}
                onPress={() => toggleAnswer(answer.answer_id)}
              >
                <Text style={styles.reviewButtonText}>
                  {expandedAnswers.has(answer.answer_id) ? 'İncelemeyi Gizle' : 'İncelemeyi Gör'}
                </Text>
              </TouchableOpacity>

              {expandedAnswers.has(answer.answer_id) && (
                <View style={styles.reviewContainer}>
                  <Text style={styles.reviewLabel}>Yorum:</Text>
                  <Text style={styles.reviewText}>{answer.review_text}</Text>
                  
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.modalCloseButtonText}>Kapat</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    backgroundColor: '#007AFF',
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  answerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  correct: {
    color: '#4CAF50',
  },
  incorrect: {
    color: '#F44336',
  },
  answerContent: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
  },
  answerText: {
    fontSize: 16,
    marginBottom: 15,
  },
  reviewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  reviewText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  viewImageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewImageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyAnswer: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
});

export default ReviewScreen; 