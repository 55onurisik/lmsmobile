import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useReview } from '../hooks/useReview';

const ReviewScreen = ({ route, navigation }) => {
  const { examId, broadcast } = route.params;
  const { exam, studentAnswers, loading, error } = useReview(examId, broadcast);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
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
        <TouchableOpacity onPress={toggleBroadcast} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {broadcast === 'yes' ? 'Yorumları Gizle' : 'Yorumları Göster'}
          </Text>
        </TouchableOpacity>
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
              
              {broadcast === 'yes' && answer.review_text && (
                <View style={styles.reviewContainer}>
                  <Text style={styles.reviewLabel}>Yorum:</Text>
                  <Text style={styles.reviewText}>{answer.review_text}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  toggleButton: {
    padding: 10,
  },
  toggleText: {
    color: '#007AFF',
    fontSize: 16,
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
    marginBottom: 10,
  },
  reviewContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 16,
    color: '#666',
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ReviewScreen; 