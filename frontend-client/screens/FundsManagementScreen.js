import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function FundsManagementScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'remove'
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');
        const { data } = await axios.get('http://localhost:8000/api/get_account_balance/', {
          params: { userid: userID },
        });
        setBalance(data.balance);
      } catch (err) {
        console.error('Balance fetch error:', err);
      }
    };
    fetchBalance();
  }, []);

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

          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Balance Display */}
          <View style={styles.balanceCard}>
            <Text style={styles.cardLabel}>Available Balance</Text>
            <Text style={styles.balanceText}>
              {balance !== null ? `$${parseFloat(balance).toFixed(2)}` : 'Loading...'}
            </Text>
          </View>

          {/* Toggle Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, action === 'add' && styles.activeTab]}
              onPress={() => setAction('add')}
            >
              <Text style={styles.tabText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, action === 'remove' && styles.activeTab]}
              onPress={() => setAction('remove')}
            >
              <Text style={styles.tabText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <TextInput
            style={styles.input}
            placeholder={`Amount to ${action === 'add' ? 'deposit' : 'withdraw'}`}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, action === 'add' ? styles.depositButton : styles.withdrawButton]}
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#1976d2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
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
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  depositButton: {
    backgroundColor: '#1976d2',
  },
  withdrawButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
