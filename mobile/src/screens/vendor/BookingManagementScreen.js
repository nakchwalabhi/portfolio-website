import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getVendorBookings, updateBookingStatus } from '../../services/api';

const STATUS_CONFIG = {
  PENDING: { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  CONFIRMED: { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle-outline' },
  REJECTED: { color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle-outline' },
  COMPLETED: { color: '#2563EB', bg: '#DBEAFE', icon: 'flag-outline' },
  CANCELLED: { color: '#6B7280', bg: '#F3F4F6', icon: 'ban-outline' },
};

export default function BookingManagementScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      const data = await getVendorBookings();
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

  const handleStatusUpdate = async (bookingId, status) => {
    const actionText = status === 'CONFIRMED' ? 'accept' : status === 'REJECTED' ? 'reject' : 'complete';

    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${actionText} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            setUpdatingId(bookingId);
            try {
              await updateBookingStatus(bookingId, status);
              Alert.alert('Success', `Booking ${actionText}ed successfully!`);
              fetchBookings();
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const renderBooking = ({ item }) => {
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;
    const isUpdating = updatingId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.bookingId}>#{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon} size={14} color={config.color} />
            <Text style={[styles.badgeText, { color: config.color }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {item.customerName || item.user?.name || 'Customer'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="bicycle" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {item.vehicleName || item.vehicle?.name || 'Vehicle'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {formatDate(item.startDate)} → {formatDate(item.endDate)}
            </Text>
          </View>
        </View>

        {item.totalPrice != null && (
          <Text style={styles.price}>₹{item.totalPrice}</Text>
        )}

        {isUpdating ? (
          <ActivityIndicator color="#2563EB" style={styles.loader} />
        ) : (
          <>
            {item.status === 'PENDING' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleStatusUpdate(item.id, 'CONFIRMED')}
                >
                  <Ionicons name="checkmark" size={18} color="#fff" />
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleStatusUpdate(item.id, 'REJECTED')}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                  <Text style={styles.actionText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}

            {item.status === 'CONFIRMED' && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleStatusUpdate(item.id, 'COMPLETED')}
              >
                <Ionicons name="flag" size={18} color="#fff" />
                <Text style={styles.actionText}>Mark Complete</Text>
              </TouchableOpacity>
            )}
          </>
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
        <Text style={styles.headerTitle}>Manage Bookings</Text>
        <Text style={styles.count}>{bookings.length} total</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No bookings yet</Text>
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
  count: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
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
  infoSection: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  completeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
});
