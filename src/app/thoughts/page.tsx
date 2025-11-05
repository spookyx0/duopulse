'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/navigation';

interface Thought {
  id: number;
  content: string;
  mood: string;
  is_pinned: boolean;
  pinned_by: { id: number; name: string } | null;
  pinned_at: string | null;
  created_by: { id: number; name: string };
  updated_by: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export default function Thoughts() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [pinnedThoughts, setPinnedThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThought, setNewThought] = useState({
    content: '',
    mood: 'calm' as string,
  });

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'bg-green-100 text-green-800' },
    { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
    { value: 'excited', label: '🎉 Excited', color: 'bg-purple-100 text-purple-800' },
    { value: 'tired', label: '😴 Tired', color: 'bg-gray-100 text-gray-800' },
    { value: 'stressed', label: '😫 Stressed', color: 'bg-red-100 text-red-800' },
    { value: 'calm', label: '😌 Calm', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'productive', label: '💪 Productive', color: 'bg-yellow-100 text-yellow-800' },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchThoughts();
    }
  }, [user, authLoading, router]);

  const fetchThoughts = async () => {
    try {
      const [allThoughtsRes, pinnedThoughtsRes] = await Promise.all([
        apiService.thoughts.getAll(),
        apiService.thoughts.getPinned(),
      ]);

      setThoughts(allThoughtsRes.data);
      setPinnedThoughts(pinnedThoughtsRes.data);
    } catch (error) {
      console.error('Failed to fetch thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThought = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.thoughts.create(newThought);
      setNewThought({ content: '', mood: 'calm' });
      setShowCreateForm(false);
      fetchThoughts(); // Refresh the list
    } catch (error) {
      console.error('Failed to create thought:', error);
    }
  };

  const handlePinThought = async (thoughtId: number) => {
    try {
      await apiService.thoughts.pin(thoughtId);
      fetchThoughts(); // Refresh the list
    } catch (error) {
      console.error('Failed to pin thought:', error);
    }
  };

  const handleUnpinThought = async (thoughtId: number) => {
    try {
      await apiService.thoughts.unpin(thoughtId);
      fetchThoughts(); // Refresh the list
    } catch (error) {
      console.error('Failed to unpin thought:', error);
    }
  };

  const handleDeleteThought = async (thoughtId: number) => {
    if (confirm('Are you sure you want to delete this thought?')) {
      try {
        await apiService.thoughts.delete(thoughtId);
        fetchThoughts(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete thought:', error);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Thoughts</h1>
            <p className="text-gray-600 mt-1">Share your thoughts and feelings with your partner</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Thought
          </button>
        </div>

        {/* Create Thought Form */}
        {showCreateForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Share a Thought</h2>
            <form onSubmit={handleCreateThought} className="space-y-4">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  What's on your mind?
                </label>
                <textarea
                  id="content"
                  rows={4}
                  required
                  value={newThought.content}
                  onChange={(e) => setNewThought({ ...newThought, content: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts, feelings, or anything you'd like..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setNewThought({ ...newThought, mood: mood.value })}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        newThought.mood === mood.value
                          ? `${mood.color} border-transparent`
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Share Thought
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pinned Thoughts */}
        {pinnedThoughts.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pinned Thoughts</h2>
            <div className="grid gap-4 mb-8">
              {pinnedThoughts.map((thought) => (
                <div key={thought.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <PinIcon className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">Pinned by {thought.pinned_by?.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUnpinThought(thought.id)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        Unpin
                      </button>
                      {thought.created_by.id === user.id && (
                        <button
                          onClick={() => handleDeleteThought(thought.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-900">{thought.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      moodOptions.find(m => m.value === thought.mood)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {moodOptions.find(m => m.value === thought.mood)?.label.split(' ')[1] || thought.mood}
                    </span>
                    <span className="text-xs text-gray-500">
                      By {thought.created_by.name} • {new Date(thought.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Thoughts */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">All Thoughts</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {thoughts
                .filter(thought => !thought.is_pinned)
                .map((thought) => (
                <li key={thought.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900">{thought.content}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              moodOptions.find(m => m.value === thought.mood)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {moodOptions.find(m => m.value === thought.mood)?.label.split(' ')[1] || thought.mood}
                            </span>
                            <span className="text-xs text-gray-500">
                              By {thought.created_by.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(thought.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => handlePinThought(thought.id)}
                          className="text-gray-400 hover:text-yellow-600"
                          title="Pin thought"
                        >
                          <PinIcon className="h-4 w-4" />
                        </button>
                        {thought.created_by.id === user.id && (
                          <button
                            onClick={() => handleDeleteThought(thought.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete thought"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {thoughts.filter(thought => !thought.is_pinned).length === 0 && (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No thoughts yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by sharing your first thought.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PlusIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> }
function PinIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> }
function TrashIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> }
function ChatBubbleLeftRightIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> }