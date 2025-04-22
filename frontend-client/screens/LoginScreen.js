import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  Image,
  Dimensions,
  ScrollView
} from 'react-native';

import axios, { AxiosResponse } from 'axios';

async function check_login() {
  const {data: res} = await axios ({
    method: 'get',
    url: "http://localhost:8000/api/check_login/?format=json",
    withCredentials: false,
  });
  console.log(res);

  const data = JSON.parse(res);

  console.log(data.isuser);
  console.log(typeof(data.isuser));
  console.log(data.isadmin);

  return data; 
}


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    // Simulate API call
    
    //const {value: res} = check_login()
    check_login()
    .then((value) => {
      console.log(value.isuser);
      console.log(value.isadmin);

      setTimeout(() => {
        setLoading(false);
  
        //if (username === 'admin' && password === '1234') { //(res.isuser === 'True') {
        if (value.isuser === 'True') {
          navigation.navigate('Home');
        } else {
          Alert.alert('Login Failed', 'Invalid username or password');
        }
      }, 1500);
      
    })

    //console.log(value)
    
    //setTimeout(() => {
      //setLoading(false);

      //console.log(res)
      //console.log(res.isuser)
      //console.log(typeof(res.isuser))

      //if (username === 'admin' && password === '1234') { //(res.isuser === 'True') {
      //  navigation.navigate('Home');
      //} else {
      //  Alert.alert('Login Failed', 'Invalid username or password');
      //}
    //}, 1500);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.phoneContainer}>
        {/* App Logo */}
        <Image
          source={require('../assets/icon.png')} // NEEDS TO BE UPDATED TO CURRENT LOGO
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
      </View>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get('window').width;
const phoneWidth = Math.min(windowWidth * 0.9, 400); // Max width 400px

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  phoneContainer: {
    width: phoneWidth,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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