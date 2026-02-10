const BASE_URL = 'http://10.0.2.2:8080/api';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth
export const register = (name, email, password, role) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });

export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Shops
export const getShops = () => request('/shops');

export const getNearbyShops = (lat, lng, radius) =>
  request(`/shops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);

export const getVendorShops = () => request('/shops/vendor');

export const createShop = (data) =>
  request('/shops', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Vehicles
export const getVehiclesByShop = (shopId) =>
  request(`/vehicles/shop/${shopId}`);

export const addVehicle = (data) =>
  request('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAvailability = (vehicleId, available) =>
  request(`/vehicles/${vehicleId}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ available }),
  });

// Bookings
export const createBooking = (vehicleId, startDate, endDate) =>
  request('/bookings', {
    method: 'POST',
    body: JSON.stringify({ vehicleId, startDate, endDate }),
  });

export const getMyBookings = () => request('/bookings/my');

export const getVendorBookings = () => request('/bookings/vendor');

export const updateBookingStatus = (bookingId, status) =>
  request(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

// Payments
export const createPaymentOrder = (bookingId) =>
  request('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ bookingId }),
  });

export const verifyPayment = (data) =>
  request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
