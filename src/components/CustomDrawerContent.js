import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'Ana Sayfa',
      icon: 'home-outline',
      screen: 'Dashboard',
    },
    {
      title: 'İstatistikler',
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
      navigation.reset({
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
        <DrawerItemList {...props} />
        <DrawerItem
          label="Close Drawer"
          onPress={() => navigation.closeDrawer()}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
}); 