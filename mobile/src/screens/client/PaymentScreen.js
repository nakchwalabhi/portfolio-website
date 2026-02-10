import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { createPaymentOrder, verifyPayment } from '../../services/api';

export default function PaymentScreen({ route, navigation }) {
  const { bookingId, totalPrice, advanceAmount, vehicleName } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = await createPaymentOrder(bookingId);

      if (Platform.OS === 'web') {
        Alert.alert('Info', 'Razorpay is not supported on web. Payment simulated.');
        await handlePaymentVerification({
          razorpay_order_id: order.orderId,
          razorpay_payment_id: 'sim_' + Date.now(),
          razorpay_signature: 'simulated',
        });
        return;
      }

      // Razorpay integration for native platforms
      let RazorpayCheckout;
      try {
        RazorpayCheckout = require('react-native-razorpay').default;
      } catch (e) {
        Alert.alert('Info', 'Razorpay SDK not available. Payment simulated for development.');
        await handlePaymentVerification({
          razorpay_order_id: order.orderId,
          razorpay_payment_id: 'sim_' + Date.now(),
          razorpay_signature: 'simulated',
        });
        return;
      }

      const options = {
        description: `Advance payment for ${vehicleName}`,
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: order.currency || 'INR',
        key: order.razorpayKey,
        amount: order.amount,
        name: 'Bike Rental',
        order_id: order.orderId,
        prefill: {
          email: user?.email || '',
          contact: '',
          name: user?.name || '',
        },
        theme: { color: '#2563EB' },
      };

      const paymentData = await RazorpayCheckout.open(options);
      await handlePaymentVerification(paymentData);
    } catch (error) {
      if (error.code !== 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Failed', error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (paymentData) => {
    try {
      await verifyPayment({
        bookingId,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpaySignature: paymentData.razorpay_signature,
      });
      Alert.alert('Success', 'Payment verified successfully!', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="card-outline" size={48} color="#2563EB" />
        </View>
        <Text style={styles.title}>Payment Summary</Text>

        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle</Text>
            <Text style={styles.value}>{vehicleName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.value}>#{bookingId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.value}>₹{totalPrice}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.highlightLabel}>Advance (50%)</Text>
            <Text style={styles.highlightValue}>₹{advanceAmount}</Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={18} color="#F59E0B" />
          <Text style={styles.noteText}>
            You need to pay 50% advance. Remaining amount to be paid at pickup.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Pay ₹{advanceAmount} Now</Text>
            </>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 8,
  },
  highlightLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
