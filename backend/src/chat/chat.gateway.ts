import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway(3002, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling']
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  private connectedUsers = new Map();

  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: { receiverId: number; message: string }) {
    try {
      const senderId = client.handshake.auth.userId;
      
      if (!senderId) {
        client.emit('error', { message: 'Authentication required' });
        return;
      }

      const message = await this.chatService.createMessage(
        senderId,
        payload.receiverId,
        payload.message,
      );

      // Notify receiver if online
      const receiverSocketId = this.connectedUsers.get(payload.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('receive_message', message);
      }

      // Send confirmation to sender
      client.emit('message_sent', { id: message.id, timestamp: message.created_at });
      
    } catch (error) {
      console.error('Message sending error:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(client: Socket, payload: { receiverId: number }) {
    const senderId = client.handshake.auth.userId;
    const receiverSocketId = this.connectedUsers.get(payload.receiverId);
    
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_typing', {
        userId: senderId,
        isTyping: true,
      });
    }
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(client: Socket, payload: { receiverId: number }) {
    const senderId = client.handshake.auth.userId;
    const receiverSocketId = this.connectedUsers.get(payload.receiverId);
    
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_typing', {
        userId: senderId,
        isTyping: false,
      });
    }
  }
}