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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addVehicle } from '../../services/api';

export default function AddVehicleScreen({ route, navigation }) {
  const { shopId } = route.params;
  const [name, setName] = useState('');
  const [type, setType] = useState('BIKE');
  const [pricePerDay, setPricePerDay] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Vehicle name is required');
      return;
    }
    if (!pricePerDay.trim() || isNaN(Number(pricePerDay)) || Number(pricePerDay) <= 0) {
      Alert.alert('Error', 'Please enter a valid price per day');
      return;
    }

    setLoading(true);
    try {
      await addVehicle({
        shopId,
        name: name.trim(),
        type,
        pricePerDay: Number(pricePerDay),
        imageUrl: imageUrl.trim() || undefined,
      });
      Alert.alert('Success', 'Vehicle added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="bicycle" size={40} color="#2563EB" />
          </View>
          <Text style={styles.title}>Add New Vehicle</Text>

          <Text style={styles.label}>Vehicle Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Honda Activa 6G"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Type *</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'BIKE' && styles.typeActive]}
              onPress={() => setType('BIKE')}
            >
              <Ionicons
                name="bicycle"
                size={22}
                color={type === 'BIKE' ? '#2563EB' : '#9CA3AF'}
              />
              <Text style={[styles.typeText, type === 'BIKE' && styles.typeTextActive]}>
                Bike
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'SCOOTER' && styles.typeActive]}
              onPress={() => setType('SCOOTER')}
            >
              <Ionicons
                name="bicycle-outline"
                size={22}
                color={type === 'SCOOTER' ? '#2563EB' : '#9CA3AF'}
              />
              <Text style={[styles.typeText, type === 'SCOOTER' && styles.typeTextActive]}>
                Scooter
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Price Per Day (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500"
            placeholderTextColor="#9CA3AF"
            value={pricePerDay}
            onChangeText={setPricePerDay}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#9CA3AF"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Add Vehicle</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
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
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  typeActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  typeTextActive: {
    color: '#2563EB',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
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
