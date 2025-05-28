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
  ScrollView,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StatisticsScreen = ({ navigation }) => {
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        paddingTop: 20,
      },
    });
  }, [navigation]);

  const BAR_WIDTH = 15;
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(statistics.length * BAR_WIDTH + 60, screenWidth - 40);

  const chartData = {
    labels: statistics.map(s => s.exam_code),
    datasets: [
      {
        data: statistics.map(s =>
          s.topics.reduce((sum, t) => {
            return sum + (t.correct || 0);
          }, 0)
        ),
      },
    ],
  };

  const pieData = [
    {
      name: 'Doğru',
      population: statistics?.reduce((sum, s) => 
        sum + (s.topics?.reduce((a, t) => a + (t.correct || 0), 0) || 0), 0
      ) || 0,
      color: '#28a745',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Yanlış',
      population: statistics?.reduce((sum, s) => 
        sum + (s.topics?.reduce((a, t) => a + (t.incorrect || 0), 0) || 0), 0
      ) || 0,
      color: '#dc3545',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Boş',
      population: statistics?.reduce((sum, s) => 
        sum + (s.topics?.reduce((a, t) => a + (t.unanswered || 0), 0) || 0), 0
      ) || 0,
      color: '#6c757d',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: () => '#333333',
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#e0e0e0',
      strokeDasharray: '5, 5',
    },
    barPercentage: 0.5,
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
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>İstatistikler</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Sınav Bazlı Doğru Sayıları</Text>
          <View style={styles.chartWrapper}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <BarChart
                data={chartData}
                width={chartWidth}
                height={250}
                chartConfig={chartConfig}
                style={styles.chart}
                fromZero
                showValuesOnTopOfBars
                segments={5}
                verticalLabelRotation={45}
                paddingLeft={0}
                paddingRight={40}
                barWidth={BAR_WIDTH}
              />
            </ScrollView>
          </View>
        </View>

        {statistics && statistics.length > 0 && (
          <View style={styles.pieChartContainer}>
            <Text style={styles.pieChartTitle}>Genel İstatistikler</Text>
            <View style={styles.pieChartWrapper}>
              <PieChart
                data={pieData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>
        )}

        
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
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  examListButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  examListButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartWrapper: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    paddingTop: 10,
  },
  scrollContent: {
    paddingLeft: 0,
  },
  chart: {
    marginVertical: 5,
    borderRadius: 16,
    marginLeft: -15,
  },
  pieChartContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pieChartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    paddingTop: 10,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10,
    marginTop: 10,
  },
  list: { paddingBottom: 10 },
  examItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  examHeader: { marginBottom: 8 },
  examTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  examCode: { fontSize: 14, color: '#666', marginTop: 4 },
  statsContainer: { 
    flexDirection: 'row', 
    marginTop: 8,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  correctText: { 
    color: '#28a745', 
    marginRight: 15 
  },
  incorrectText: { 
    color: '#dc3545',
    marginRight: 15
  },
  emptyText: { 
    color: '#6c757d' 
  },
  disabledExamItem: { opacity: 0.6, backgroundColor: '#e9ecef' },
  disabledText: { color: '#6c757d' },
  notSolvedText: { color: '#6c757d', fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  examChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default StatisticsScreen;
