import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';

async function get_balance(userid) {
  const { data } = await axios.get(
      'http://localhost:8000/api/check_login/',
      { params: { username, password } }
    );
}

export default function HomeScreen({ navigation }) {
  // Mock data
  const portfolioData = {



    //balance: "$12,450.00",
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
          {/* Header */}
          <Text style={styles.header}>Mr Fintastic!</Text>
          
           {/* Balance Card (Clickable) */}
           <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('FundsManagement')} 
          >
            <Text style={styles.cardLabel}>Available Balance</Text>
            <Text style={styles.balanceText}>{portfolioData.balance}</Text>
          </TouchableOpacity>
          
          {/* Total Assets (Clickable) */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('AssetDetails')}
          >
            <Text style={styles.cardLabel}>Total Assets</Text>
            <Text style={styles.assetText}>{portfolioData.totalAssets}</Text>
          </TouchableOpacity>
          
          {/* Asset Breakdown */}
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
          
          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('BuyAssets')}
            >
              <Text style={styles.buttonText}>Buy Assets</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.sellButton]}
              onPress={() => navigation.navigate('SellAssets')}
            >
              <Text style={styles.buttonText}>Sell Assets</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: '#f0f0f0', // Frame color
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
    color: '#2e7d32', // Green for balance
  },
  assetText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2', // Blue for assets
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
    color: '#2e7d32', // Green
  },
  negative: {
    color: '#d32f2f', // Red
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
  sellButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});