'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { socketService } from '@/services/socket';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  is_read: boolean;
  created_at: string;
  sender: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

export default function Chat() {
  const { user, partner } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (partner) {
      fetchMessages();
      setupSocketListeners();
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user, partner, router]);

  const fetchMessages = async () => {
    try {
      const response = await apiService.chat.getMessages(partner!.id);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listen for new messages
    socketService.onMessageReceived((message: Message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicators
    socketService.onTyping((data: { userId: number; isTyping: boolean }) => {
      if (data.userId === partner!.id) {
        setIsTyping(data.isTyping);
      }
    });

    // Connect to socket if not already connected
    if (user) {
      socketService.connect(user.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !partner) return;

    try {
      // Send via WebSocket for real-time
      socketService.sendMessage(partner.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (partner) {
      if (typing) {
        socketService.startTyping(partner.id);
      } else {
        socketService.stopTyping(partner.id);
      }
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

  if (!user || !partner) {
    return null;
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-lg shadow">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {partner.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">{partner.name}</h2>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm text-gray-500">
                  {isTyping ? 'typing...' : 'Online'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === user.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender_id === user.id
                      ? 'text-blue-200'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage}>
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping(true);
                }}
                onBlur={() => handleTyping(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTyping(false);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}