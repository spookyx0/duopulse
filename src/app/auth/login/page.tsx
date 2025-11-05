'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('🔐 Login page auth check:', { 
        token: !!token, 
        user: !!user 
      });
      
      if (token && user) {
        console.log('✅ User already logged in, redirecting to dashboard');
        // Use window.location for hard redirect
        window.location.href = '/dashboard';
        return;
      }
      
      setIsCheckingAuth(false);
    };

    // Delay the check to ensure everything is loaded
    setTimeout(checkAuth, 100);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Starting login process...');
      
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
      console.log('✅ Login API response:', data);
      
      // Store auth data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('💾 Auth data stored in localStorage');
      console.log('Token stored:', !!data.access_token);
      console.log('User stored:', !!data.user);
      
      // Wait a moment to ensure storage is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify storage
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('🔍 Storage verification:', {
        token: !!storedToken,
        user: !!storedUser
      });
      
      if (!storedToken || !storedUser) {
        throw new Error('Failed to store authentication data');
      }
      
      // Use hard redirect to avoid React state issues
      console.log('🔄 Redirecting to dashboard...');
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
            <div className="text-3xl font-bold text-blue-600">DuoPulse</div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Email: quinnreeve@example.com</p>
              <p>Password: password123</p>
              <p className="mt-2">Or</p>
              <p>Email: aliyah@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </form>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">Debug Info</h3>
          <div className="text-xs text-yellow-700 mt-2 space-y-1">
            <p>Backend: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}</p>
            <p>Token in storage: {localStorage.getItem('token') ? 'YES' : 'NO'}</p>
            <p>User in storage: {localStorage.getItem('user') ? 'YES' : 'NO'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}