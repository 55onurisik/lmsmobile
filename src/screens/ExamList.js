import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExamList = ({ navigation }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await client.get('/exams');
      if (response.data.success) {
        setExams(response.data.exams);
      }
    } catch (e) {
      console.error('Exams fetch error:', e);
      Alert.alert('Hata', 'Sınavlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchExams();
  }, [isAuthenticated]);

  const renderExamItem = ({ item }) => (
    <TouchableOpacity
      style={styles.examItem}
      onPress={() => navigation.navigate('ExamDetail', { exam: item })}
    >
      <View style={styles.examHeader}>
        <Text style={styles.examTitle}>{item.exam_title}</Text>
        <Text style={styles.examCode}>Kod: {item.exam_code}</Text>
      </View>
      <View style={styles.examInfo}>
        <Text style={styles.questionCount}>{item.question_count} Soru</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sınavlar</Text>
      </View>
      <FlatList
        data={exams}
        renderItem={renderExamItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 15,
  },
  examItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  examHeader: {
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  examCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  examInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  questionCount: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    // ... existing code ...
  },
});

export default ExamList; 