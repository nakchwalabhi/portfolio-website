import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { getShops } from '../../services/api';

export default function ShopListScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const data = await getShops();
      setShops(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchShops();
  };

  const renderShop = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VehicleList', { shopId: item.id, shopName: item.shopName })}
    >
      <View style={styles.cardIcon}>
        <Ionicons name="storefront-outline" size={28} color="#2563EB" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.shopName}>{item.shopName}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.shopAddress}>{item.address || 'No address provided'}</Text>
        </View>
        {item.distance != null && (
          <View style={styles.infoRow}>
            <Ionicons name="navigate-outline" size={14} color="#10B981" />
            <Text style={styles.distance}>{item.distance.toFixed(1)} km away</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading shops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Rental Shops</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {shops.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No shops available</Text>
          <Text style={styles.emptySubtext}>Pull down to refresh</Text>
        </View>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderShop}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  shopAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  distance: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
});
