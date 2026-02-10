import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyBookings } from '../../services/api';

const STATUS_CONFIG = {
  PENDING: { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  CONFIRMED: { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle-outline' },
  REJECTED: { color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle-outline' },
  COMPLETED: { color: '#2563EB', bg: '#DBEAFE', icon: 'flag-outline' },
  CANCELLED: { color: '#6B7280', bg: '#F3F4F6', icon: 'ban-outline' },
};

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderBooking = ({ item }) => {
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.bookingId}>Booking #{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon} size={14} color={config.color} />
            <Text style={[styles.badgeText, { color: config.color }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.vehicleName}>{item.vehicleName || item.vehicle?.name || 'Vehicle'}</Text>

        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.dateLabel}>From:</Text>
            <Text style={styles.dateValue}>{formatDate(item.startDate)}</Text>
          </View>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.dateLabel}>To:</Text>
            <Text style={styles.dateValue}>{formatDate(item.endDate)}</Text>
          </View>
        </View>

        {item.totalPrice != null && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>₹{item.totalPrice}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Your bookings will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderBooking}
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
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
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
