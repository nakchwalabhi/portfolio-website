import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { getVendorShops, createShop, getVehiclesByShop } from '../../services/api';

export default function ShopDashboardScreen({ navigation }) {
  const { logout, user } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [creating, setCreating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const shopData = await getVendorShops();
      const shopList = Array.isArray(shopData) ? shopData : [];
      setShops(shopList);

      if (shopList.length > 0) {
        const vehicleData = await getVehiclesByShop(shopList[0].id);
        setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCreateShop = async () => {
    if (!shopName.trim() || !shopAddress.trim()) {
      Alert.alert('Error', 'Shop name and address are required');
      return;
    }
    setCreating(true);
    try {
      await createShop({
        name: shopName.trim(),
        address: shopAddress.trim(),
        phone: shopPhone.trim(),
        latitude: 0.0,
        longitude: 0.0,
      });
      Alert.alert('Success', 'Shop created successfully!');
      setShowCreateForm(false);
      setShopName('');
      setShopAddress('');
      setShopPhone('');
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCreating(false);
    }
  };

  const renderVehicle = ({ item }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleInfo}>
        <Ionicons
          name={item.type === 'SCOOTER' ? 'bicycle-outline' : 'bicycle'}
          size={22}
          color="#2563EB"
        />
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.vehiclePrice}>₹{item.pricePerDay}/day</Text>
        </View>
      </View>
      <View style={[styles.statusDot, item.available ? styles.dotAvailable : styles.dotUnavailable]} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Vendor'}</Text>
          <Text style={styles.headerTitle}>Shop Dashboard</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
      >
        {shops.length === 0 ? (
          <View style={styles.noShopContainer}>
            <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
            <Text style={styles.noShopText}>You don't have a shop yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateForm(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create Shop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.shopSection}>
            {shops.map((shop) => (
              <View key={shop.id} style={styles.shopCard}>
                <View style={styles.shopHeader}>
                  <Ionicons name="storefront" size={24} color="#2563EB" />
                  <Text style={styles.shopName}>{shop.name}</Text>
                </View>
                <View style={styles.shopInfoRow}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.shopInfo}>{shop.address}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {showCreateForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create New Shop</Text>

            <Text style={styles.label}>Shop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter shop name"
              placeholderTextColor="#9CA3AF"
              value={shopName}
              onChangeText={setShopName}
            />

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter shop address"
              placeholderTextColor="#9CA3AF"
              value={shopAddress}
              onChangeText={setShopAddress}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              value={shopPhone}
              onChangeText={setShopPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, creating && styles.buttonDisabled]}
                onPress={handleCreateShop}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {shops.length > 0 && (
          <View style={styles.vehiclesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vehicles ({vehicles.length})</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddVehicle', { shopId: shops[0].id })}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {vehicles.length === 0 ? (
              <View style={styles.emptyVehicles}>
                <Text style={styles.emptyText}>No vehicles added yet</Text>
              </View>
            ) : (
              <FlatList
                data={vehicles}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderVehicle}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>
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
  greeting: {
    fontSize: 14,
    color: '#6B7280',
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
  noShopContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noShopText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shopSection: {
    padding: 16,
  },
  shopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  shopInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shopInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    marginBottom: 14,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  vehiclesSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleDetails: {
    gap: 2,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  vehiclePrice: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotAvailable: {
    backgroundColor: '#10B981',
  },
  dotUnavailable: {
    backgroundColor: '#EF4444',
  },
  emptyVehicles: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
