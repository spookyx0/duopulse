'use client';

import { useState, useEffect } from 'react';
import { api, apiService } from '@/services/api';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Try to fetch partner data, but don't fail if it doesn't work
        try {
          await fetchPartner();
        } catch (partnerError) {
          console.warn('Failed to fetch partner data:', partnerError);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't logout here, just clear the error
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchPartner = async () => {
    try {
      const response = await apiService.users.getPartner();
      setPartner(response.data);
    } catch (error) {
      console.error('Failed to fetch partner:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      console.log('Attempting login with:', email);
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { access_token, user: userData } = response.data;
      
      // Store auth data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set authorization header for future requests
      api.defaults.headers.Authorization = `Bearer ${access_token}`;
      
      // Update state
      setUser(userData);
      
      // Try to fetch partner data
      try {
        await fetchPartner();
      } catch (partnerError) {
        console.warn('Partner fetch failed, but login successful:', partnerError);
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPartner(null);
    setError(null);
    delete api.defaults.headers.Authorization;
  };

  return {
    user,
    partner,
    login,
    logout,
    loading,
    error,
    refreshPartner: fetchPartner
  };
}