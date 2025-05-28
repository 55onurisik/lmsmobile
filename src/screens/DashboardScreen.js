import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { exams, loading, error, student } = useDashboard();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
    }
  };

  const renderStudentCard = () => (
    <View style={styles.studentCard}>
      <View style={styles.studentHeader}>
        <Ionicons name="person-circle" size={40} color="#007AFF" />
        <Text style={styles.studentName}>{student?.name}</Text>
      </View>
      <View style={styles.studentInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color="#666" />
          <Text style={styles.infoText}>{student?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#666" />
          <Text style={styles.infoText}>{student?.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school" size={20} color="#666" />
          <Text style={styles.infoText}>{student?.class_level}.Sınıf</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.infoText}>
            {student?.schedule_day} {student?.schedule_time}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExamItem = ({ item }) => {
    const isCompleted = item.is_completed;

    return (
      <TouchableOpacity
        style={[
          styles.examItem,
          isCompleted && styles.completedExamItem
        ]}
        onPress={() => {
          if (isCompleted) {
            navigation.navigate('Review', { 
              examId: item.id,
              broadcast: false
            });
          } else {
            navigation.navigate('Answer', { examId: item.id });
          }
        }}
      >
        <View style={styles.examInfo}>
          <View>
            <Text style={styles.examTitle}>{item.exam_title}</Text>
            <Text style={styles.examCode}>Kod: {item.exam_code}</Text>
          </View>
          <View style={styles.examDetails}>
            <Text style={styles.questionCount}>
              {item.question_count} Soru
            </Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>Çözüldü</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      

      <ScrollView style={styles.content}>
        {renderStudentCard()}
        
        <View style={styles.examSection}>
          <Text style={styles.sectionTitle}>Sınavlarım</Text>
          <FlatList
            data={exams}
            renderItem={renderExamItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
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
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  studentCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  studentInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  examSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  examItem: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 24,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  completedExamItem: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  examInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  examCode: {
    color: '#666',
    marginTop: 5,
  },
  examDetails: {
    alignItems: 'flex-end',
  },
  questionCount: {
    color: '#666',
    marginBottom: 5,
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen; 