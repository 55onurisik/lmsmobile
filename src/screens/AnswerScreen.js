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
import client from '../api/client';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      const formattedAnswers = {};
      
      exam.questions.forEach(q => {
        formattedAnswers[q.id] = answers[q.id] === 'Boş' ? null : answers[q.id];
      });

      await client.post(`/exams/${examId}/submit`, { answers: formattedAnswers });
      
      Alert.alert(
        'Başarılı',
        'Cevaplarınız kaydedildi.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'MainDrawer' }],
            })
          }
        ]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert(
        'Hata',
        'Cevaplar kaydedilirken bir hata oluştu.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'MainDrawer' }],
            })
          }
        ]
      );
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
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sınav</Text>
      </View>

      <ScrollView style={styles.content}>
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
  menuButton: {
    marginRight: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
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
    borderRadius: 24,
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
    borderRadius: 24,
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
    borderRadius: 24,
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
