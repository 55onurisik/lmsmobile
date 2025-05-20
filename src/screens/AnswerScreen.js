import React, { useState } from 'react';
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
  const { exam, questions, loading, error } = useExamQuestions(examId);
  const { submit, loading: submitting } = useSubmitAnswers(examId);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    const result = await submit(answers);
    if (result.success) {
      navigation.replace('Review', { examId, broadcast: 'no' });
    } else {
      Alert.alert('Hata', result.error);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exam?.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        {questions.map((question) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionNumber}>
              {question.id}. Soru
            </Text>
            <Text style={styles.questionText}>{question.question_text}</Text>
            
            <RadioButton.Group
              onValueChange={(value) => handleAnswer(question.id, value)}
              value={answers[question.id] || ''}
            >
              {['A', 'B', 'C', 'D', 'E'].map((option) => (
                <View key={option} style={styles.optionContainer}>
                  <RadioButton value={option.toLowerCase()} />
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Sınavı Tamamla</Text>
        )}
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
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
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

export default AnswerScreen; 