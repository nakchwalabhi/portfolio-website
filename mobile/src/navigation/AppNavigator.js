import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

// Client screens
import LoginScreen from '../screens/client/LoginScreen';
import RegisterScreen from '../screens/client/RegisterScreen';
import ShopListScreen from '../screens/client/ShopListScreen';
import VehicleListScreen from '../screens/client/VehicleListScreen';
import BookingScreen from '../screens/client/BookingScreen';
import PaymentScreen from '../screens/client/PaymentScreen';
import BookingHistoryScreen from '../screens/client/BookingHistoryScreen';

// Vendor screens
import ShopDashboardScreen from '../screens/vendor/ShopDashboardScreen';
import AddVehicleScreen from '../screens/vendor/AddVehicleScreen';
import BookingManagementScreen from '../screens/vendor/BookingManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#2563EB' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '600' },
};

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ShopList') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'BookingHistory') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      })}
    >
      <Tab.Screen
        name="ShopList"
        component={ShopListScreen}
        options={{ title: 'Shops', headerShown: false }}
      />
      <Tab.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{ title: 'My Bookings', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function VendorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ShopDashboard') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'BookingManagement') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      })}
    >
      <Tab.Screen
        name="ShopDashboard"
        component={ShopDashboardScreen}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <Tab.Screen
        name="BookingManagement"
        component={BookingManagementScreen}
        options={{ title: 'Bookings', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token, user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!token ? (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : user?.role === 'VENDOR' ? (
        <Stack.Group>
          <Stack.Screen
            name="VendorMain"
            component={VendorTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddVehicle"
            component={AddVehicleScreen}
            options={{ title: 'Add Vehicle' }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="ClientMain"
            component={ClientTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VehicleList"
            component={VehicleListScreen}
            options={{ title: 'Vehicles' }}
          />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ title: 'Book Vehicle' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Payment' }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
