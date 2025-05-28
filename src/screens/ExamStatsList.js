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
import { PieChart } from 'react-native-chart-kit';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { Dimensions } from 'react-native';

const ExamStatsList = ({ navigation }) => {
  const [exams, setExams] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const screenWidth = Dimensions.get('window').width;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, statsRes] = await Promise.all([
        client.get('/exams'),
        client.get('/statistics'),
      ]);
      if (examsRes.data.success) setExams(examsRes.data.exams);
      if (statsRes.data.success) setStatistics(statsRes.data.statistics);
    } catch (e) {
      console.error('Statistics fetch error:', e);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: () => '#333333',
  };

  const renderExamItem = ({ item }) => {
    const stats = statistics.find(st => st.exam_id === item.id);
    const totalCorrect = stats?.topics.reduce((a, t) => a + (t.correct || 0), 0) || 0;
    const totalIncorrect = stats?.topics.reduce((a, t) => a + (t.incorrect || 0), 0) || 0;
    const totalEmpty = stats?.topics.reduce((a, t) => a + (t.unanswered || 0), 0) || 0;
    const hasStats = totalCorrect > 0 || totalIncorrect > 0 || totalEmpty > 0;

    const examPieData = [
      {
        name: 'Doğru',
        population: totalCorrect,
        color: '#28a745',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Yanlış',
        population: totalIncorrect,
        color: '#dc3545',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Boş',
        population: totalEmpty,
        color: '#6c757d',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];

    return (
      <TouchableOpacity
        style={[styles.examItem, !hasStats && styles.disabledExamItem]}
        onPress={() =>
          hasStats && navigation.navigate('StatisticsDetail', { exam: item, stats })
        }
        disabled={!hasStats}
      >
        <View style={styles.examHeader}>
          <Text style={[styles.examTitle, !hasStats && styles.disabledText]}>
            {item.exam_title}
          </Text>
          <Text style={[styles.examCode, !hasStats && styles.disabledText]}>
            Kod: {item.exam_code}
          </Text>
        </View>
        {hasStats && (
          <View style={styles.examChartContainer}>
            <PieChart
              data={examPieData}
              width={120}
              height={120}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </View>
        )}
        <View style={styles.statsContainer}>
          <Text style={[styles.correctText, !hasStats && styles.disabledText]}>
            Doğru: {totalCorrect}
          </Text>
          <Text style={[styles.incorrectText, !hasStats && styles.disabledText]}>
            Yanlış: {totalIncorrect}
          </Text>
          <Text style={[styles.emptyText, !hasStats && styles.disabledText]}>
            Boş: {totalEmpty}
          </Text>
        </View>
        {!hasStats && <Text style={styles.notSolvedText}>Henüz çözülmedi</Text>}
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerText}>Sınav İstatistikleri</Text>
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  examChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  correctText: {
    color: '#28a745',
    marginRight: 15,
  },
  incorrectText: {
    color: '#dc3545',
    marginRight: 15,
  },
  emptyText: {
    color: '#6c757d',
  },
  disabledExamItem: {
    opacity: 0.6,
    backgroundColor: '#e9ecef',
  },
  disabledText: {
    color: '#6c757d',
  },
  notSolvedText: {
    color: '#6c757d',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default ExamStatsList; 