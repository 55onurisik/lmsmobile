import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useReview } from '../hooks/useReview';

const AnswerItem = ({ item, isExpanded, onToggle }) => {
  const getStatusBadge = (isCorrect) => {
    if (isCorrect === 2) {
      return (
        <View style={[styles.badge, styles.emptyBadge]}>
          <Text style={styles.badgeText}>Boş</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, isCorrect === 1 ? styles.correctBadge : styles.incorrectBadge]}>
        <Text style={styles.badgeText}>{isCorrect === 1 ? 'Doğru' : 'Yanlış'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.answerItem}>
      <View style={styles.answerHeader}>
        <Text style={styles.questionId}>Soru {item.answer_id}</Text>
        {getStatusBadge(item.is_correct)}
      </View>
      
      <Text style={styles.studentAnswer}>
        Cevabınız: {item.students_answer}
      </Text>

      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => onToggle(item.answer_id)}
      >
        <Text style={styles.toggleButtonText}>
          {isExpanded ? 'İncelemeyi Gizle' : 'İncelemeyi Gör'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.reviewContent}>
          {item.review_text && (
            <Text style={styles.reviewText}>{item.review_text}</Text>
          )}
          {item.review_media && (
            <Image
              source={{ uri: item.review_media }}
              style={styles.reviewImage}
              resizeMode="contain"
            />
          )}
        </View>
      )}
    </View>
  );
};

export default function ReviewPage({ route }) {
  const { examId, broadcast } = route.params;
  const { studentAnswers, loading, error } = useReview(examId, broadcast);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleAnswer = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    Alert.alert(
      'Hata',
      'Değerlendirme yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
      [{ text: 'Tamam' }]
    );
    return null;
  }

  return (
    <FlatList
      data={studentAnswers}
      keyExtractor={(item) => item.answer_id.toString()}
      renderItem={({ item }) => (
        <AnswerItem
          item={item}
          isExpanded={expandedIds.has(item.answer_id)}
          onToggle={toggleAnswer}
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  answerItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  studentAnswer: {
    fontSize: 14,
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  reviewContent: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewImage: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 6,
  },
  emptyBadge: {
    backgroundColor: '#6c757d',
  },
  correctBadge: {
    backgroundColor: '#4CAF50', // Doğru cevap için yeşil renk
  },
  incorrectBadge: {
    backgroundColor: '#F44336', // Yanlış cevap için kırmızı renk
  },
}); 