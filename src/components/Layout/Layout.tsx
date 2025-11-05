'use client';

import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import { socketService } from '@/services/socket';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to WebSocket when user is authenticated
      socketService.connect(user.id);
    }

    return () => {
      // Cleanup on unmount
      socketService.removeAllListeners();
    };
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}