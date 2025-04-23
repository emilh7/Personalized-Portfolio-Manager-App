import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AssetDetailsScreen({ navigation }) {
  // TODO: Replace with backend data from Django
  const userAssets = [
    { id: 9003, name: 'AAPL', quantity: 20, value: 175.25 },
    { id: 9006, name: 'TSLA', quantity: 8, value: 720.45 },
    { id: 9001, name: 'US10Y', quantity: 5, value: 1000.00 },
  ];

  return (
    <View style={styles.phoneFrame}>
      <View style={styles.phoneScreen}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.header}>My Assets</Text>

          {userAssets.map((asset) => (
            <View key={asset.id} style={styles.assetCard}>
              <View>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetQty}>Quantity: {asset.quantity}</Text>
              </View>
              <Text style={styles.assetValue}>${(asset.value * asset.quantity).toFixed(2)}</Text>
            </View>
          ))}

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
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Lobster-Regular',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  assetCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assetQty: {
    fontSize: 14,
    color: '#666',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});
