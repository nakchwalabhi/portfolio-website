import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBooking } from '../../services/api';

export default function BookingScreen({ route, navigation }) {
  const { vehicle } = route.params;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const totalPrice = days * (vehicle.pricePerDay || 0);
  const advanceAmount = Math.round(totalPrice * 0.5);

  const validateDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please enter both start and end dates');
      return;
    }
    if (!validateDate(startDate) || !validateDate(endDate)) {
      Alert.alert('Error', 'Please enter valid dates in YYYY-MM-DD format');
      return;
    }
    if (days <= 0) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking(vehicle.id, startDate, endDate);
      Alert.alert('Booking Created', 'Proceed to payment?', [
        { text: 'Later', style: 'cancel', onPress: () => navigation.goBack() },
        {
          text: 'Pay Now',
          onPress: () =>
            navigation.navigate('Payment', {
              bookingId: booking.id,
              totalPrice,
              advanceAmount,
              vehicleName: vehicle.name,
            }),
        },
      ]);
    } catch (error) {
      Alert.alert('Booking Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.vehicleCard}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={vehicle.type === 'SCOOTER' ? 'bicycle-outline' : 'bicycle'}
            size={40}
            color="#2563EB"
          />
        </View>
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
        <Text style={styles.vehicleType}>{vehicle.type}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{vehicle.pricePerDay}/day</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Select Dates</Text>

        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9CA3AF"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9CA3AF"
          value={endDate}
          onChangeText={setEndDate}
        />

        {days > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{days} day{days > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rate</Text>
              <Text style={styles.summaryValue}>₹{vehicle.pricePerDay}/day</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{totalPrice}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.advanceLabel}>Advance (50%)</Text>
              <Text style={styles.advanceValue}>₹{advanceAmount}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, (loading || days <= 0) && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={loading || days <= 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Book & Pay</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 12,
  },
  priceTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
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
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  advanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  advanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
