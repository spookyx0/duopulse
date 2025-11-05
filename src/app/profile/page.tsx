'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/navigation';

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalThoughts: number;
  pinnedThoughts: number;
  totalFiles: number;
  totalMessages: number;
}

export default function Profile() {
  const { user, partner, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchUserStats();
  }, [user, router]);

  const fetchUserStats = async () => {
    try {
      // Fetch all data to calculate stats
      const [tasksRes, thoughtsRes, filesRes, chatRes] = await Promise.all([
        apiService.tasks.getAll(),
        apiService.thoughts.getAll(),
        apiService.files.getAll(),
        apiService.chat.getMessages(partner?.id || 0),
      ]);

      const tasks = tasksRes.data || [];
      const thoughts = thoughtsRes.data || [];
      const files = filesRes.data || [];
      const messages = chatRes.data || [];

      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t: any) => t.status === 'completed').length,
        totalThoughts: thoughts.length,
        pinnedThoughts: thoughts.filter((t: any) => t.is_pinned).length,
        totalFiles: files.length,
        totalMessages: messages.length,
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-blue-100">{user.email}</p>
                <p className="text-blue-200 text-sm mt-1">Member since {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tasks</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.completedTasks}/{stats?.totalTasks} completed
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Messages</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats?.totalMessages}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <PhotoIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Thoughts</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.pinnedThoughts}/{stats?.totalThoughts} pinned
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Information */}
        {partner && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Partner</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {partner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                  <p className="text-gray-500">{partner.email}</p>
                  <div className="flex items-center mt-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/tasks')}
              className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600 mx-auto" />
              <span className="block text-sm font-medium text-gray-900 mt-2">Tasks</span>
            </button>
            
            <button
              onClick={() => router.push('/chat')}
              className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 mx-auto" />
              <span className="block text-sm font-medium text-gray-900 mt-2">Chat</span>
            </button>
            
            <button
              onClick={() => router.push('/calendar')}
              className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="h-6 w-6 text-purple-600 mx-auto" />
              <span className="block text-sm font-medium text-gray-900 mt-2">Calendar</span>
            </button>
            
            <button
              onClick={() => router.push('/files')}
              className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <DocumentIcon className="h-6 w-6 text-orange-600 mx-auto" />
              <span className="block text-sm font-medium text-gray-900 mt-2">Files</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ClipboardDocumentListIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> }
function ChatBubbleLeftRightIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> }
function PhotoIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
function CalendarIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
function DocumentIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }