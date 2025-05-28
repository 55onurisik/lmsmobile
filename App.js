import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import * as ReactNative from 'react-native';

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

//const { LogBox } = require('react-native');

// tüm warning'leri gizle
//LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Answer" component={AnswerScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ExamStatsList" component={ExamStatsList} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="ExamList" component={ExamList} />
          <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
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
