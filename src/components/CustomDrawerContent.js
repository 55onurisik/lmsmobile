import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export function CustomDrawerContent(props) {
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'Ana Sayfa',
      icon: 'home-outline',
      screen: 'Dashboard',
    },
    {
      title: 'Genel İstatistikler',
      icon: 'stats-chart-outline',
      screen: 'Statistics',
    },
    {
      title: 'Sınav İstatistikleri',
      icon: 'bar-chart-outline',
      screen: 'ExamStatsList',
    },
    {
      title: 'Sonuçları Gör',
      icon: 'list-outline',
      screen: 'ExamList',
    },
    {
      title: 'Sohbet',
      icon: 'chatbubble-outline',
      screen: 'Chat',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LMS Mobile</Text>
        </View>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color="#333" style={styles.icon} />
            <Text style={styles.drawerItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#333" style={styles.icon} />
          <Text style={styles.drawerItemText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 15,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
}); 