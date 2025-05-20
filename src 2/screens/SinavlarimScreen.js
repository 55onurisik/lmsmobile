import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const SinavlarimScreen = ({ navigation }) => {
  // Örnek sınav verileri
  const sinavlar = [
    { id: '1', title: 'Matematik Sınavı', date: '15 Mayıs 2024', durum: 'Beklemede' },
    { id: '2', title: 'Fizik Sınavı', date: '20 Mayıs 2024', durum: 'Tamamlandı' },
    { id: '3', title: 'Kimya Sınavı', date: '25 Mayıs 2024', durum: 'Beklemede' },
  ];

  const renderSinavItem = ({ item }) => (
    <TouchableOpacity style={styles.sinavItem}>
      <Text style={styles.sinavTitle}>{item.title}</Text>
      <Text style={styles.sinavDate}>Tarih: {item.date}</Text>
      <Text style={[
        styles.sinavDurum,
        { color: item.durum === 'Tamamlandı' ? '#4CAF50' : '#FFA000' }
      ]}>
        {item.durum}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sınavlarım</Text>
      
      <FlatList
        data={sinavlar}
        renderItem={renderSinavItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  sinavItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sinavTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sinavDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sinavDurum: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SinavlarimScreen; 