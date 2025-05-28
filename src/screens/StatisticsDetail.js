const renderTopicItem = ({ item }) => {
  const totalQuestions = item.total_questions;
  const correctCount = item.topics.reduce((sum, t) => sum + (t.is_correct === 1 ? 1 : 0), 0);
  const incorrectCount = item.topics.reduce((sum, t) => sum + (t.is_correct === 0 ? 1 : 0), 0);
  const emptyCount = item.topics.reduce((sum, t) => sum + (t.is_correct === 2 ? 1 : 0), 0);
  
  const correctPercentage = ((correctCount / totalQuestions) * 100).toFixed(1);
  const incorrectPercentage = ((incorrectCount / totalQuestions) * 100).toFixed(1);
  const emptyPercentage = ((emptyCount / totalQuestions) * 100).toFixed(1);

  return (
    <View style={styles.topicItem}>
      <Text style={styles.topicTitle}>{item.topic_name}</Text>
      <View style={styles.topicStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Doğru</Text>
          <Text style={[styles.statValue, styles.correctText]}>
            {correctCount} ({correctPercentage}%)
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Yanlış</Text>
          <Text style={[styles.statValue, styles.incorrectText]}>
            {incorrectCount} ({incorrectPercentage}%)
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Boş</Text>
          <Text style={[styles.statValue, styles.emptyText]}>
            {emptyCount} ({emptyPercentage}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

const pieData = [
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
];

const styles = StyleSheet.create({
  // ... existing styles ...
  emptyText: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
}); 