import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const StatisticsDetailScreen = ({ route, navigation }) => {
  const { exam, stats } = route.params;

  const totalCorrect = stats?.topics.reduce((sum, topic) => sum + topic.correct, 0) || 0;
  const totalIncorrect = stats?.topics.reduce((sum, topic) => sum + topic.incorrect, 0) || 0;

  const pieData = [
    {
      name: 'Doğru',
      population: totalCorrect,
      color: '#28a745',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Yanlış',
      population: totalIncorrect,
      color: '#dc3545',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    propsForLabels: {
      fontSize: 14,
      fontWeight: 'bold'
    }
  };

  const renderTopicItem = ({ item }) => (
    <View style={styles.topicItem}>
      <Text style={styles.topicName}>{item.topic_name}</Text>
      <View style={styles.topicStats}>
        <Text style={styles.correctText}>Doğru: {item.correct}</Text>
        <Text style={styles.incorrectText}>Yanlış: {item.incorrect}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.examCode}>{exam.code}</Text>
        <Text style={styles.examName}>{exam.name}</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Genel İstatistik</Text>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={true}
          center={[(Dimensions.get('window').width - 40) / 4, 0]}
        />
      </View>

      <View style={styles.topicsContainer}>
        <Text style={styles.topicsTitle}>Konu Bazlı İstatistikler</Text>
        <FlatList
          data={stats?.topics || []}
          renderItem={renderTopicItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.topicsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  examCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  examName: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  topicsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topicsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  topicsList: {
    paddingBottom: 10,
  },
  topicItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 24,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  topicStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  correctText: {
    color: '#28a745',
    marginRight: 15,
  },
  incorrectText: {
    color: '#dc3545',
  },
  chart: {
    marginVertical: 5,
    borderRadius: 24,
    marginLeft: -15,
  },
});

export default StatisticsDetailScreen; 