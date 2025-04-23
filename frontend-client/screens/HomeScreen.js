import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import LogoutButton from '../components/LogoutButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [balance, setBalance] = useState('$0.00');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');
        if (!userID) return;

        const { data } = await axios.get('http://localhost:8000/api/get_account_balance/', {
          params: { userid: userID }
        });

        setBalance(`$${parseFloat(data.balance).toFixed(2)}`);
      } catch (err) {
        console.error('Balance fetch error:', err);
      }
    };

    fetchBalance();
  }, []);

  const portfolioData = {
    balance: balance,
    totalAssets: "$56,780.00",
    assets: [
      { name: "Stocks", value: "$32,450.00", change: "+2.4%" },
      { name: "Commodities", value: "$15,230.00", change: "-1.2%" },
      { name: "Bonds", value: "$9,100.00", change: "+0.5%" },
    ]
  };

  return (
    <View style={styles.phoneFrame}>
      <View style={styles.phoneScreen}>
        <ScrollView contentContainerStyle={styles.container}>
          <LogoutButton navigation={navigation} />

          <Text style={styles.header}>Mr Fintastic!</Text>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('FundsManagement')}
          >
            <Text style={styles.cardLabel}>Available Balance</Text>
            <Text style={styles.balanceText}>{portfolioData.balance}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('AssetDetails')}
          >
            <Text style={styles.cardLabel}>Total Assets</Text>
            <Text style={styles.assetText}>{portfolioData.totalAssets}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Asset Allocation</Text>
          {portfolioData.assets.map((asset, index) => (
            <View key={index} style={styles.assetCard}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <View style={styles.assetValueContainer}>
                <Text style={styles.assetValue}>{asset.value}</Text>
                <Text style={[
                  styles.assetChange,
                  asset.change.startsWith('+') ? styles.positive : styles.negative
                ]}>
                  {asset.change}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Transaction')}
            >
              <Text style={styles.buttonText}>Buy and Sell!</Text>
            </TouchableOpacity>
          </View>
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
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: "Lobster-Regular",
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
  assetText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '500',
  },
  assetValueContainer: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assetChange: {
    fontSize: 14,
  },
  positive: {
    color: '#2e7d32',
  },
  negative: {
    color: '#d32f2f',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
