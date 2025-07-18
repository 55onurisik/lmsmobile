import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import * as ReactNative from 'react-native';
import { CustomDrawerContent } from './src/components/CustomDrawerContent';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AnswerScreen from './src/screens/AnswerScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ChatScreen from './src/screens/ChatScreen';
import ExamStatsList from './src/screens/ExamStatsList';
import StatisticsScreen from './src/screens/StatisticsScreen';
import ExamList from './src/screens/ExamList';
import ExamDetailScreen from './src/screens/ExamDetailScreen';

const { LogBox } = require('react-native');

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '75%',
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Answer" component={AnswerScreen} />
      <Drawer.Screen name="Review" component={ReviewScreen} />
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="ExamStatsList" component={ExamStatsList} />
      <Drawer.Screen name="Statistics" component={StatisticsScreen} />
      <Drawer.Screen name="ExamList" component={ExamList} />
      <Drawer.Screen name="ExamDetail" component={ExamDetailScreen} />
    </Drawer.Navigator>
  );
}

const Navigation = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log('Navigation state:', { isAuthenticated, loading });

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}
