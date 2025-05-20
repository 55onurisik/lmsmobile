import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { authAPI } from '../api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.getUser();
      console.log('Profile Screen Response:', response);

      if (response.success && response.data) {
        // API'den gelen veriyi doğrudan kullan
        console.log('User Data:', response.data);
        setUser(response.data);
      } else {
        setError(response.error || 'Kullanıcı bilgileri alınamadı');
      }
    } catch (err) {
      console.error('Profile Load Error:', err);
      setError(err.message);
      
      if (err.message.includes('Oturum süresi dolmuş')) {
        Alert.alert(
          'Oturum Sonlandı',
          'Oturum süreniz dolmuş, lütfen tekrar giriş yapın',
          [
            { text: 'Tamam', onPress: () => navigation.navigate('Login') }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ad Soyad:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>E-posta:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>
            {user.role === 'student' ? 'Öğrenci' : user.role === 'teacher' ? 'Öğretmen' : 'Belirtilmemiş'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Üyelik Tarihi:</Text>
          <Text style={styles.value}>
            {user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Son Güncelleme:</Text>
          <Text style={styles.value}>
            {user.updated_at ? new Date(user.updated_at).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen; 