import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExamStatsList = ({ navigation }) => {
  const [exams, setExams] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

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
    const stats = statistics.find(st => st.exam_id === item.id) || { topics: [] };
    const totalCorrect   = stats.topics.reduce((sum, t) => sum + (t.correct   || 0), 0);
    const totalIncorrect = stats.topics.reduce((sum, t) => sum + (t.incorrect || 0), 0);
    const totalEmpty     = stats.topics.reduce((sum, t) => sum + (t.unanswered|| 0), 0);
    const hasStats = totalCorrect || totalIncorrect || totalEmpty;

    const pieData = [
      { name: 'Doğru',    population: totalCorrect,   color: '#28a745', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      { name: 'Yanlış',   population: totalIncorrect, color: '#dc3545', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      { name: 'Boş',      population: totalEmpty,     color: '#6c757d', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    ];

    return (
      <TouchableOpacity
        style={[styles.examItem, !hasStats && styles.disabledExamItem]}
        onPress={() => hasStats && navigation.navigate('StatisticsDetail', { exam: item, stats })}
        disabled={!hasStats}
      >
        <View style={styles.header}>
          <Text style={[styles.title, !hasStats && styles.disabledText]}>
            {item.exam_title}
          </Text>
          <Text style={[styles.code, !hasStats && styles.disabledText]}>
            Kod: {item.exam_code}
          </Text>
        </View>

        {hasStats && (
          <View style={styles.statsContainer}>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                width={100}
                height={100}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                hasLegend={false}
                center={[15, 0]}
                absolute
              />
            </View>
            <View style={styles.numbers}>
              <Text style={styles.correctText}>Doğru: {totalCorrect}</Text>
              <Text style={styles.incorrectText}>Yanlış: {totalIncorrect}</Text>
              <Text style={styles.emptyText}>Boş: {totalEmpty}</Text>
            </View>
          </View>
        )}

        {!hasStats && <Text style={styles.notSolved}>Henüz çözülmedi</Text>}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menu}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Sınav İstatistikleri</Text>
      </View>

      <FlatList
        data={exams}
        renderItem={renderExamItem}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f5f5f5' },
  topBar:           { backgroundColor: '#007AFF', paddingTop: 50, padding: 15, flexDirection: 'row', alignItems: 'center' },
  menu:             { marginRight: 5 },
  topBarTitle:      { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loading:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:             { padding: 15 },

  examItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledExamItem: { opacity: 0.5 },

  header:           { marginBottom: 10 },
  title:            { fontSize: 18, fontWeight: 'bold', color: '#333' },
  code:             { fontSize: 14, color: '#666', marginTop: 4 },
  disabledText:     { color: '#aaa' },

  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  chartContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 24,
  },
  numbers: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 5,
  },

  correctText:      { color: '#28a745', fontSize: 16, marginBottom: 4 },
  incorrectText:    { color: '#dc3545', fontSize: 16, marginBottom: 4 },
  emptyText:        { color: '#6c757d', fontSize: 16 },

  notSolved:        { fontStyle: 'italic', color: '#999', marginTop: 8 },
});


export default ExamStatsList;
