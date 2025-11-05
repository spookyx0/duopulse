'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';

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

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔐 Auth check - Token:', !!token, 'User:', !!userData);
        
        if (token && userData) {
          // Set axios header for API calls
          api.defaults.headers.Authorization = `Bearer ${token}`;
          
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('✅ User authenticated:', parsedUser.name);
          
          // Try to fetch partner, but don't block if it fails
          fetchPartner().catch(error => {
            console.warn('Partner fetch failed:', error);
          });
        } else {
          console.log('❌ No auth data found');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchPartner = async () => {
    try {
      const response = await api.get('/users/partner');
      setPartner(response.data);
      console.log('✅ Partner data loaded:', response.data.name);
    } catch (error) {
      console.error('Failed to fetch partner:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Login attempt for:', email);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Login successful:', data.user);
      
      // Store in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update axios headers
      api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
      
      // Update state
      setUser(data.user);
      
      // Fetch partner data
      await fetchPartner();
      
      return true;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = (): void => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPartner(null);
    delete api.defaults.headers.Authorization;
  };

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  return {
    user,
    partner,
    login,
    logout,
    loading,
    isAuthenticated,
    refreshPartner: fetchPartner
  };
}