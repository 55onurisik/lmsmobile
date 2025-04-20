import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { authAPI } from '../api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await authAPI.getCurrentUser();
      setUserData(data);
    } catch (error) {
      console.log('Get user error:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigation.replace('Login');
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Hata', 'Çıkış yapılamadı.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{userData?.name || 'Kullanıcı'}</Text>
        <Text style={styles.email}>{userData?.email || ''}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hesap Ayarları</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.menuText}>Profil Bilgileri</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="lock" size={24} color="#666" />
          <Text style={styles.menuText}>Şifre Değiştir</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="notifications" size={24} color="#666" />
          <Text style={styles.menuText}>Bildirim Ayarları</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help" size={24} color="#666" />
          <Text style={styles.menuText}>Yardım ve Destek</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info" size={24} color="#666" />
          <Text style={styles.menuText}>Hakkında</Text>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="logout" size={24} color="#ff3b30" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
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
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default ProfileScreen; 