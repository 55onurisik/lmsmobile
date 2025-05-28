import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useExamQuestions } from '../hooks/useExamQuestions';
import { useSubmitAnswers } from '../hooks/useSubmitAnswers';

const AnswerScreen = ({ route, navigation }) => {
  const { examId } = route.params;
  const { exam, loading: questionsLoading, error: questionsError } = useExamQuestions(examId);
  const { submit, loading: submitLoading, error: submitError } = useSubmitAnswers(examId);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const answers = questions.map(q => ({
        question_id: q.id,
        selected_answer: q.selectedAnswer === 'Boş' ? null : q.selectedAnswer.toUpperCase()
      }));

      const response = await client.post('/submit-answers', { answers });
      if (response.data.success) {
        navigation.navigate('Review', { 
          examId: exam.id,
          answers: response.data.answers.map(a => ({
            ...a,
            is_correct: a.selected_answer === null ? 2 : (a.is_correct ? 1 : 0)
          }))
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Hata', 'Cevaplar kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (questionsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (questionsError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{questionsError}</Text>
      </View>
    );
  }

  if (!exam || !exam.questions) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Sınav bulunamadı veya sorular yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{exam.title}</Text>
      
      {exam.questions.map((question, index) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {index + 1}. {question.question_text}
          </Text>
          
          <View style={styles.optionsContainer}>
            {['A', 'B', 'C', 'D', 'E', 'Boş'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  answers[question.id] === option && styles.selectedOption
                ]}
                onPress={() => handleAnswer(question.id, option)}
              >
                <Text style={[
                  styles.optionText,
                  answers[question.id] === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, submitLoading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={submitLoading}
      >
        {submitLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Sınavı Tamamla</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  optionButton: {
    width: '15.5%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 16,
    color: '#212529',
  },
  selectedOptionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AnswerScreen; 