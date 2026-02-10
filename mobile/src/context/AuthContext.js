import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register as apiRegister, setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    const { token: newToken, name, role } = response;
    setToken(newToken);
    const userInfo = { name, email, role };
    setUser(userInfo);
    setAuthToken(newToken);
    await AsyncStorage.setItem('authToken', newToken);
    await AsyncStorage.setItem('authUser', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (name, email, password, role) => {
    const response = await apiRegister(name, email, password, role);
    const { token: newToken } = response;
    setToken(newToken);
    const userInfo = { name, email, role };
    setUser(userInfo);
    setAuthToken(newToken);
    await AsyncStorage.setItem('authToken', newToken);
    await AsyncStorage.setItem('authUser', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
  };

  const value = useMemo(
    () => ({ token, user, isLoading, login, logout, register }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
