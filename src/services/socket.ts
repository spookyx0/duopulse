import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: number) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Chat methods
  sendMessage(receiverId: number, message: string) {
    this.socket?.emit('send_message', { receiverId, message });
  }

  onMessageReceived(callback: (message: any) => void) {
    this.socket?.on('receive_message', callback);
  }

  onTyping(callback: (data: { userId: number; isTyping: boolean }) => void) {
    this.socket?.on('user_typing', callback);
  }

  startTyping(receiverId: number) {
    this.socket?.emit('typing_start', { receiverId });
  }

  stopTyping(receiverId: number) {
    this.socket?.emit('typing_stop', { receiverId });
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();