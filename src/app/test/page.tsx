'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [authStatus, setAuthStatus] = useState<string>('Checking...');

  useEffect(() => {
    testBackendConnection();
    testAuthentication();
  }, []);

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/health');
      if (response.ok) {
        setBackendStatus('✅ Backend is running');
      } else {
        setBackendStatus('❌ Backend connection failed');
      }
    } catch (error) {
      setBackendStatus('❌ Backend connection failed');
    }
  };

  const testAuthentication = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthStatus('❌ No token found');
        return;
      }

      const response = await api.get('/auth/me');
      if (response.status === 200) {
        setAuthStatus('✅ Authentication working');
      } else {
        setAuthStatus('❌ Authentication failed');
      }
    } catch (error) {
      setAuthStatus('❌ Authentication failed');
    }
  };

  const testLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        email: 'quinnreeve@example.com',
        password: 'password123'
      });
      console.log('Test login response:', response.data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuthStatus('✅ Login successful');
    } catch (error: any) {
      console.error('Test login failed:', error);
      setAuthStatus(`❌ Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Backend Status:</h2>
            <p>{backendStatus}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Authentication Status:</h2>
            <p>{authStatus}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={testLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Test Login
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                setAuthStatus('Local storage cleared');
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Clear Local Storage
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="text-sm">
              Token: {localStorage.getItem('token') ? 'Exists' : 'Missing'}

              User: {localStorage.getItem('user') ? 'Exists' : 'Missing'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}