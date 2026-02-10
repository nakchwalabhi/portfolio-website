import React, { useState, useEffect } from 'react';
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
import { getVehiclesByShop } from '../../services/api';

export default function VehicleListScreen({ route, navigation }) {
  const { shopId, shopName } = route.params;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: shopName || 'Vehicles' });
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getVehiclesByShop(shopId);
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const getTypeIcon = (type) => {
    return type === 'SCOOTER' ? 'bicycle-outline' : 'bicycle';
  };

  const renderVehicle = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.available && styles.cardUnavailable]}
      onPress={() => {
        if (item.available) {
          navigation.navigate('Booking', { vehicle: item });
        } else {
          Alert.alert('Unavailable', 'This vehicle is currently not available for booking.');
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Ionicons name={getTypeIcon(item.type)} size={24} color="#2563EB" />
          <Text style={styles.vehicleType}>{item.type}</Text>
        </View>
        <View style={[styles.badge, item.available ? styles.badgeAvailable : styles.badgeUnavailable]}>
          <Text style={[styles.badgeText, item.available ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      <Text style={styles.vehicleName}>{item.name}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.pricePerDay}</Text>
        <Text style={styles.perDay}>/day</Text>
      </View>

      {item.available && (
        <View style={styles.bookRow}>
          <Text style={styles.bookText}>Tap to book</Text>
          <Ionicons name="arrow-forward" size={16} color="#2563EB" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading vehicles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="bicycle-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No vehicles available</Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderVehicle}
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
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardUnavailable: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeAvailable: {
    backgroundColor: '#D1FAE5',
  },
  badgeUnavailable: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextAvailable: {
    color: '#059669',
  },
  badgeTextUnavailable: {
    color: '#DC2626',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#10B981',
  },
  perDay: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 2,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 4,
  },
  bookText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
});
