import React, { useState } from 'react';
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
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

const ReviewScreen = ({ route, navigation }) => {
  const { examId, broadcast } = route.params;
  const { exam, studentAnswers, loading, error } = useReview(examId, broadcast);
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleAnswer = (answerId) => {
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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorAlert 
      message={error.response?.data?.message || error.message || 'Değerlendirme yüklenirken bir hata oluştu.'} 
      onRetry={() => navigation.goBack()}
    />;
  }

  const toggleBroadcast = () => {
    navigation.setParams({
      broadcast: broadcast === 'yes' ? 'no' : 'yes',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exam?.title}</Text>
        <Text style={styles.subtitle}>Yorumlar</Text>
      </View>

      <ScrollView style={styles.content}>
        {studentAnswers.map((answer) => (
          <View key={answer.answer_id} style={styles.answerContainer}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>
                {answer.answer_id}. Soru
              </Text>
              <Text
                style={[
                  styles.answerStatus,
                  answer.is_correct ? styles.correct : styles.incorrect,
                ]}
              >
                {answer.is_correct ? 'Doğru' : 'Yanlış'}
              </Text>
            </View>

            <View style={styles.answerContent}>
              <Text style={styles.answerText}>
                Cevabınız: {answer.students_answer.toUpperCase()}
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
                  {answer.review_media && (
                    <>
                      <TouchableOpacity 
                        style={styles.viewImageButton}
                        onPress={() => setSelectedImage(answer.review_media)}
                      >
                        <Text style={styles.viewImageButtonText}>Resmi Görüntüle</Text>
                      </TouchableOpacity>
                      <Image
                        source={{ uri: answer.review_media }}
                        style={styles.reviewImage}
                        resizeMode="contain"
                      />
                    </>
                  )}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.backButtonText}>Sınavlara Dön</Text>
      </TouchableOpacity>

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
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  answerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default ReviewScreen; 