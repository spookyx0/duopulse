'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Check localStorage directly for auth
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🏠 Home page - Token:', !!token, 'User:', !!user);
    
    if (token && user) {
      console.log('🔄 Redirecting to dashboard');
      window.location.href = '/dashboard';
    } else {
      console.log('🔄 Redirecting to login');
      window.location.href = '/auth/login';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading DuoPulse...</p>
      </div>
    </div>
  );
}