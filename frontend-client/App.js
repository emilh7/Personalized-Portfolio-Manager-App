import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Lobster_400Regular } from '@expo-google-fonts/lobster';
import { View, Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';
import FundsManagementScreen from './screens/FundsManagementScreen';
import TransactionScreen from './screens/TransactionScreen'
import AssetDetails from './screens/AssetDetailsScreen'

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
        {/* Authentication Screens */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Register" 
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        
        {/* Main App Screens */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        
        {/* Financial Management Screens */}
        <Stack.Screen 
          name="FundsManagement" 
          component={FundsManagementScreen}
          options={{ 
            title: 'Manage Funds',
            headerTitleStyle: {
              fontFamily: 'Lobster-Regular',
              fontSize: 20,
            },
            headerBackTitleVisible: false
          }}
        />
        {/*Transaction Screen (Buying and Selling)*/}
        <Stack.Screen 
          name="Transaction" 
          component={TransactionScreen}
          options={{
            title: 'Trade Assets',
            headerTitleStyle: {
              fontFamily: 'Lobster-Regular',
              fontSize: 20,
            },
            headerBackTitleVisible: false,
          }}
        />
        {/*Asset Detail Screen*/}
        <Stack.Screen
          name="AssetDetails"
          component={AssetDetails}
          options={{ headerShown: false }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}