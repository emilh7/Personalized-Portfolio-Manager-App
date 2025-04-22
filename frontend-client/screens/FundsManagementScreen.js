import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

export default function FundsManagementScreen({ navigation, route }) {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'remove'

  const handleTransaction = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    console.log(`${action === 'add' ? 'Adding' : 'Removing'} $${numericAmount}`);
    navigation.navigate('Home', { 
      updatedBalance: action === 'add' ? numericAmount : -numericAmount 
    });
  };

  return (
    <View style={styles.phoneFrame}>
      <View style={styles.phoneScreen}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {action === 'add' ? 'Add Funds' : 'Withdraw Funds'}
          </Text>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, action === 'add' && styles.activeToggle]}
              onPress={() => setAction('add')}
            >
              <Text style={styles.toggleText}>Add</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toggleButton, action === 'remove' && styles.activeToggle]}
              onPress={() => setAction('remove')}
            >
              <Text style={styles.toggleText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder={`Amount to ${action === 'add' ? 'add' : 'withdraw'}`}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleTransaction}
          >
            <Text style={styles.buttonText}>
              Confirm {action === 'add' ? 'Deposit' : 'Withdrawal'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// constant dimensions for demo
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
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Lobster-Regular',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  activeToggle: {
    backgroundColor: '#1976d2',
  },
  toggleText: {
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    alignSelf: 'center',
    padding: 10,
  },
  backButtonText: {
    color: '#1976d2',
    fontSize: 16,
  },
});