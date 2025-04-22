import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function TransactionScreen({ navigation }) {
  const [mode, setMode] = useState('buy');
  const [quantityMap, setQuantityMap] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const availableAssets = [
    { id: 9001, name: 'US10Y Bond', value: 1000.0 },
    { id: 9002, name: 'Gold', value: 2000.0 },
    { id: 9003, name: 'AAPL', value: 175.25 },
    { id: 9004, name: 'GOOGL', value: 2850.5 },
    { id: 9005, name: 'AMZN', value: 3450.75 },
    { id: 9006, name: 'TSLA', value: 720.45 },
  ];

  const userOwnedAssets = [
    { id: 9003, name: 'AAPL', value: 175.25, ownedQty: 20 },
    { id: 9006, name: 'TSLA', value: 720.45, ownedQty: 8 },
  ];

  const handleTransaction = (asset) => {
    const qty = quantityMap[asset.id];
    if (!qty) return;
    alert(`${mode === 'buy' ? 'Buying' : 'Selling'} ${qty} of ${asset.name}`);
    setQuantityMap((prev) => ({ ...prev, [asset.id]: '' }));
    setExpandedId(null);
  };

  const handleExpandToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleQuantityChange = (id, value) => {
    setQuantityMap((prev) => ({ ...prev, [id]: value }));
  };

  const assetsToShow = mode === 'buy' ? availableAssets : userOwnedAssets;

  return (
    <View style={styles.phoneFrame}>
      <View style={styles.phoneScreen}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, mode === 'buy' && styles.activeTab]}
              onPress={() => setMode('buy')}
            >
              <Text style={styles.tabText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'sell' && styles.activeTab]}
              onPress={() => setMode('sell')}
            >
              <Text style={styles.tabText}>Sell</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>{mode === 'buy' ? 'Assets to Buy' : 'Your Assets'}</Text>

          {assetsToShow.map((asset) => {
            const expanded = expandedId === asset.id;
            return (
              <View key={asset.id} style={[styles.assetCard, expanded && styles.expandedCard]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleExpandToggle(asset.id)}
                  style={styles.assetTopRow}
                >
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <View style={styles.chartAndPrice}>
                    <View style={styles.fakeChart} />
                    <Text style={styles.assetPrice}>${asset.value.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>

                {expanded && (
                  <View style={styles.expandedContent}>
                    <TextInput
                      style={styles.input}
                      placeholder="Quantity"
                      value={quantityMap[asset.id] || ''}
                      onChangeText={(text) => handleQuantityChange(asset.id, text)}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={[styles.actionButton, mode === 'buy' ? styles.buyButton : styles.sellButton]}
                      onPress={() => handleTransaction(asset)}
                    >
                      <Text style={styles.buttonText}>{mode === 'buy' ? 'Buy Now' : 'Sell Now'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  phoneScreen: {
    width: phoneWidth,
    height: phoneHeight,
    backgroundColor: 'white',
    borderRadius: 40,
    overflow: 'hidden',
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assetCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  expandedCard: {
    backgroundColor: '#f5faff',
  },
  assetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  chartAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fakeChart: {
    width: 40,
    height: 20,
    backgroundColor: '#cce5ff',
    marginRight: 10,
    borderRadius: 4,
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expandedContent: {
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#1976d2',
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
