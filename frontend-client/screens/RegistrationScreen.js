import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';

import axios from 'axios';

async function registerApi({ username, email, password, password2 }) {
  const { data } = await axios.post(
    'http://localhost:8000/api/register/',
    { username, email, password, password2 }
  );
  return data; // { success: true } or { error: "..." }
}

export default function RegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    const { username, email, password1, password2 } = formData;
    if (!username||!email||!password1||!password2) {
      return Alert.alert('Error','All fields required');
    }
    setLoading(true);
    try {
      const res = await registerApi({
        username, email,
        password: password1,
        password2
      });
      if (res.success) {
        Alert.alert('Success','Account created');
        navigation.replace('Login');
      } else {
        Alert.alert('Registration Failed', res.error || 'Unknown error');
      }
    } catch (err) {
      console.warn(err.response?.data);
      Alert.alert('Error','Could not reach server');
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
          <Text style={styles.title}>Create Account</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => handleChange('username', text)}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password1}
            onChangeText={(text) => handleChange('password1', text)}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.password2}
            onChangeText={(text) => handleChange('password2', text)}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLinkText}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}


const phoneWidth = 393;
const phoneHeight = 852;

const styles = StyleSheet.create({
  phoneFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Lobster-Regular', // Add this if you're using custom font
  },
  input: {
    width: '100%',
    height: 50,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 25,
    alignSelf: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});