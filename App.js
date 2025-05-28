import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AnswerScreen from './src/screens/AnswerScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ChatScreen from './src/screens/ChatScreen';
import ExamStatsList from './src/screens/ExamStatsList';
import StatisticsScreen from './src/screens/StatisticsScreen';
import ExamList from './src/screens/ExamList';

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
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Answer" component={AnswerScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ExamStatsList" component={ExamStatsList} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="ExamList" component={ExamList} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}
