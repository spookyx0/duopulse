import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    server: Server;
    constructor(chatService: ChatService);
    private connectedUsers;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, payload: {
        receiverId: number;
        message: string;
    }): Promise<void>;
    handleTypingStart(client: Socket, payload: {
        receiverId: number;
    }): void;
    handleTypingStop(client: Socket, payload: {
        receiverId: number;
    }): void;
}
