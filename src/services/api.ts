import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - REMOVE the auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically logout on 401 - let components handle it
    return Promise.reject(error);
  }
);

// API methods for different endpoints
export const apiService = {
  // Tasks
  tasks: {
    getAll: () => api.get('/tasks'),
    getById: (id: number) => api.get(`/tasks/${id}`),
    create: (data: any) => api.post('/tasks', data),
    update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
    delete: (id: number) => api.delete(`/tasks/${id}`),
  },

  // Calendar
  calendar: {
    getAll: () => api.get('/calendar'),
    getUpcoming: (days: number = 7) => api.get(`/calendar/upcoming?days=${days}`),
    create: (data: any) => api.post('/calendar', data),
    update: (id: number, data: any) => api.put(`/calendar/${id}`, data),
    delete: (id: number) => api.delete(`/calendar/${id}`),
  },

  // Thoughts
  thoughts: {
    getAll: () => api.get('/thoughts'),
    getPinned: () => api.get('/thoughts/pinned'),
    create: (data: any) => api.post('/thoughts', data),
    update: (id: number, data: any) => api.put(`/thoughts/${id}`, data),
    pin: (id: number) => api.patch(`/thoughts/${id}/pin`),
    unpin: (id: number) => api.patch(`/thoughts/${id}/unpin`),
    delete: (id: number) => api.delete(`/thoughts/${id}`),
  },

  // Chat
  chat: {
    getMessages: (partnerId: number) => api.get(`/chat/messages/${partnerId}`),
    getUnreadCount: () => api.get('/chat/unread-count'),
    getConversations: () => api.get('/chat/conversations'),
  },

  // Users
  users: {
    getPartner: () => api.get('/users/partner'),
    getProfile: () => api.get('/users/profile'),
  },

  // Files
  files: {
    getAll: () => api.get('/files'),
    upload: (formData: FormData) => api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id: number) => api.delete(`/files/${id}`),
  }
};