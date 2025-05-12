import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RadioButton } from 'react-native-paper';

const ExamPage = ({ route, navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const { examId, questionCount } = route.params;

  useEffect(() => {
    // Burada API'den soruları çekeceğiz
    // Örnek veri:
    const dummyQuestions = Array.from({ length: questionCount }, (_, i) => ({
      id: i + 1,
      question: `Soru ${i + 1}`,
      options: ['A', 'B', 'C', 'D', 'E'],
    }));
    setQuestions(dummyQuestions);
  }, [questionCount]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    // Burada cevapları API'ye göndereceğiz
    console.log('Cevaplar:', answers);
    // Sınav tamamlandıktan sonra yönlendirme yapabiliriz
    navigation.navigate('Sinavlarim');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {questions.map((question) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionNumber}>
              {question.id}. Soru
            </Text>
            <Text style={styles.questionText}>{question.question}</Text>
            
            <RadioButton.Group
              onValueChange={(value) => handleAnswer(question.id, value)}
              value={answers[question.id] || ''}
            >
              {question.options.map((option) => (
                <View key={option} style={styles.optionContainer}>
                  <RadioButton value={option} />
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Sınavı Tamamla</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  questionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExamPage; 