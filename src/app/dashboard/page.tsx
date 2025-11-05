'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/navigation';

interface DashboardData {
  recentTasks: any[];
  pinnedThoughts: any[];
  upcomingEvents: any[];
  unreadMessages: number;
  tasksStats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only redirect if we've confirmed the user is not logged in
    if (!authLoading && !user && authChecked) {
      console.log('No user found, redirecting to login');
      router.push('/auth/login');
      return;
    }

    if (user && !authLoading) {
      setAuthChecked(true);
      fetchDashboardData();
    }
  }, [user, authLoading, router, authChecked]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [tasksRes, thoughtsRes, eventsRes, chatRes] = await Promise.all([
        apiService.tasks.getAll(),
        apiService.thoughts.getPinned(),
        apiService.calendar.getUpcoming(7),
        apiService.chat.getUnreadCount(),
      ]);

      const tasks = tasksRes.data || [];
      const tasksStats = {
        total: tasks.length,
        completed: tasks.filter((t: any) => t.status === 'completed').length,
        pending: tasks.filter((t: any) => t.status === 'pending').length,
        inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
      };

      setData({
        recentTasks: tasks.slice(0, 5),
        pinnedThoughts: thoughtsRes.data || [],
        upcomingEvents: eventsRes.data || [],
        unreadMessages: chatRes.data?.count || 0,
        tasksStats,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTaskStatusUpdate = async (taskId: number, newStatus: string) => {
    try {
      await apiService.tasks.update(taskId, { status: newStatus });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with you and your partner today.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                    <dd className="text-lg font-medium text-gray-900">{data?.tasksStats.total || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <CheckIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-gray-900">{data?.tasksStats.completed || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{data?.tasksStats.inProgress || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                    <dd className="text-lg font-medium text-gray-900">{data?.unreadMessages || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
                <button 
                  onClick={() => router.push('/tasks')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all
                </button>
              </div>
              <div className="p-6 space-y-4">
                {data?.recentTasks?.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </span>
                        <span className="text-xs text-gray-500">
                          By: {task.created_by?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusUpdate(task.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
                {(!data?.recentTasks || data.recentTasks.length === 0) && (
                  <div className="text-center py-8">
                    <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/tasks')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pinned Thoughts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Pinned Thoughts</h2>
                <button 
                  onClick={() => router.push('/thoughts')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all
                </button>
              </div>
              <div className="p-6 space-y-4">
                {data?.pinnedThoughts?.map((thought) => (
                  <div key={thought.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-gray-900">{thought.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">
                        By {thought.created_by?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(thought.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        thought.mood === 'happy' ? 'bg-green-100 text-green-800' :
                        thought.mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                        thought.mood === 'excited' ? 'bg-purple-100 text-purple-800' :
                        thought.mood === 'tired' ? 'bg-gray-100 text-gray-800' :
                        thought.mood === 'stressed' ? 'bg-red-100 text-red-800' :
                        thought.mood === 'calm' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {thought.mood}
                      </span>
                    </div>
                  </div>
                ))}
                {(!data?.pinnedThoughts || data.pinnedThoughts.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No pinned thoughts</p>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
              </div>
              <div className="p-6 space-y-4">
                {data?.upcomingEvents?.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">
                        {new Date(event.start_time).toLocaleDateString()} • {new Date(event.start_time).toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.location}
                      </span>
                    </div>
                  </div>
                ))}
                {(!data?.upcomingEvents || data.upcomingEvents.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Add missing icons
function ClipboardDocumentListIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> }
function CheckIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> }
function ClockIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function ChatBubbleLeftRightIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> }
function PlusIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> }