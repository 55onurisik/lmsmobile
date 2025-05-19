import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Card } from 'react-native-paper';

const StatisticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    emptyAnswers: 0,
  });

  useEffect(() => {
    // Burada API'den istatistikleri çekeceğiz
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // API çağrısı burada yapılacak
      // Örnek veri:
      const dummyStats = {
        totalExams: 15,
        completedExams: 12,
        averageScore: 75.5,
        highestScore: 95,
        lowestScore: 45,
        totalQuestions: 150,
        correctAnswers: 90,
        wrongAnswers: 45,
        emptyAnswers: 15,
      };
      
      setStats(dummyStats);
      setLoading(false);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>İstatistikler</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Sınav Genel Bakış</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Toplam Sınav:</Text>
              <Text style={styles.statValue}>{stats.totalExams}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Tamamlanan Sınav:</Text>
              <Text style={styles.statValue}>{stats.completedExams}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Ortalama Puan:</Text>
              <Text style={styles.statValue}>%{stats.averageScore}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>En Yüksek ve En Düşük</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>En Yüksek Puan:</Text>
              <Text style={styles.statValue}>%{stats.highestScore}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>En Düşük Puan:</Text>
              <Text style={styles.statValue}>%{stats.lowestScore}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Soru İstatistikleri</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Toplam Soru:</Text>
              <Text style={styles.statValue}>{stats.totalQuestions}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Doğru Cevap:</Text>
              <Text style={[styles.statValue, styles.correctText]}>{stats.correctAnswers}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Yanlış Cevap:</Text>
              <Text style={[styles.statValue, styles.wrongText]}>{stats.wrongAnswers}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Boş Cevap:</Text>
              <Text style={[styles.statValue, styles.emptyText]}>{stats.emptyAnswers}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  card: {
    margin: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  correctText: {
    color: '#4CAF50',
  },
  wrongText: {
    color: '#F44336',
  },
  emptyText: {
    color: '#9E9E9E',
  },
});

export default StatisticsScreen; 