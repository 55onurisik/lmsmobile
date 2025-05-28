import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import client from '../api/client';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExamDetailScreen = ({ route, navigation }) => {
  const { exam } = route.params;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await client.get('/statistics');
      if (response.data.success) {
        // Sınav ID'sine göre istatistikleri filtrele
        const examStats = response.data.statistics.find(s => s.exam_id === exam.id);
        if (examStats) {
          setStats(examStats);
        } else {
          // Eğer sınav için istatistik yoksa boş bir obje oluştur
          setStats({
            topics: [],
            exam_id: exam.id,
            exam_code: exam.exam_code
          });
        }
      }
    } catch (e) {
      console.error('Stats fetch error:', e);
      Alert.alert('Hata', 'İstatistikler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [exam.id])
  );

  const renderTopicStats = () => {
    if (!stats?.topics) return null;

    return stats.topics.map((topic, index) => {
      const total = topic.correct + topic.incorrect + topic.unanswered;
      const correctPercentage = ((topic.correct / total) * 100).toFixed(1);
      const incorrectPercentage = ((topic.incorrect / total) * 100).toFixed(1);
      const emptyPercentage = ((topic.unanswered / total) * 100).toFixed(1);

      return (
        <View key={index} style={styles.topicContainer}>
          <Text style={styles.topicTitle}>{topic.topic_name}</Text>
          <View style={styles.topicStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#28a745' }]}>{topic.correct}</Text>
              <Text style={styles.statLabel}>Doğru ({correctPercentage}%)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#dc3545' }]}>{topic.incorrect}</Text>
              <Text style={styles.statLabel}>Yanlış ({incorrectPercentage}%)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#6c757d' }]}>{topic.unanswered}</Text>
              <Text style={styles.statLabel}>Boş ({emptyPercentage}%)</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  const pieData = stats ? [
    {
      name: 'Doğru',
      population: stats.topics.reduce((sum, t) => sum + (t.correct || 0), 0),
      color: '#28a745',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Yanlış',
      population: stats.topics.reduce((sum, t) => sum + (t.incorrect || 0), 0),
      color: '#dc3545',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Boş',
      population: stats.topics.reduce((sum, t) => sum + (t.unanswered || 0), 0),
      color: '#6c757d',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ] : [];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: () => '#333333',
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
          style={styles.backButton}
          onPress={() => navigation.navigate('ExamList')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sınav Detayı</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{exam.exam_title}</Text>
          <Text style={styles.code}>Kod: {exam.exam_code}</Text>
        </View>

        {stats && (
          <>
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Genel İstatistikler</Text>
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

            <View style={styles.topicsContainer}>
              <Text style={styles.topicsTitle}>Konu Bazlı Performans</Text>
              {renderTopicStats()}
            </View>
          </>
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
    borderBottomColor: '#007AFF',
  },
  backButton: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  code: {
    fontSize: 16,
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  topicsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  topicsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  topicContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  topicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default ExamDetailScreen; 