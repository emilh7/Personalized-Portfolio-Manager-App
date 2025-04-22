import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';
import { View, Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FundsManagementScreen from './screens/FundsManagementScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lobster-Regular': Lobster_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="FundsManagement" 
          component={FundsManagementScreen} 
          options={{ 
            title: 'Manage Funds',
            headerTitleStyle: {
              fontFamily: 'Lobster-Regular',
              fontSize: 20,
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}