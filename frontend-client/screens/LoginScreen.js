import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';


const phoneWidth = 393;
const phoneHeight = 852;

import axios, { AxiosResponse } from 'axios';

async function check_login(username, password) {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/check_login/',
      { username, password }
    );
    return response.data; // Return parsed API response
  } catch (err) {
    console.error('API call failed:', err);
    throw err; // Propagate the error
  }
}



export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    setLoading(true);
  
    try {
      // Get the FULL response from check_login
      const response = await check_login(username, password);
      console.log('Login API Response:', response); // Check this in browser console
      // Destructure values safely
      const { isuser = false, userID = null } = response;
  
      if (isuser) {
        navigation.replace('Home', { 
          userID: response.userID // Must match "route.params.userID"
        });
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Login failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <View style={styles.phoneFrame}>
      <View style={styles.phoneScreen}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Login"
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

          <View style={styles.linksContainer}>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Forgot Password?
            </Text>

            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Register')}
            >
              Don't have an account? Sign Up
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneFrame: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  phoneScreen: {
    width: phoneWidth,
    height: phoneHeight,
    backgroundColor: 'white',
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',  // or 'flex-start' if you want to start at top
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#0066cc',
    marginVertical: 8,
    fontSize: 14,
  },
});
