'use client';

import { useState, useEffect } from 'react';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on component mount
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔐 Auth check - Token:', !!token, 'User:', !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('✅ User authenticated:', parsedUser.name);
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
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Login successful:', data.user);
      
      // Store in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      
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
  };

  return {
    user,
    login,
    logout,
    loading
  };
}