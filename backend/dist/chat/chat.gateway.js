"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        console.log('Client connected:', client.id);
        const userId = client.handshake.auth.userId;
        if (userId) {
            this.connectedUsers.set(userId, client.id);
            console.log(`User ${userId} connected with socket ${client.id}`);
        }
    }
    handleDisconnect(client) {
        console.log('Client disconnected:', client.id);
        for (const [userId, socketId] of this.connectedUsers.entries()) {
            if (socketId === client.id) {
                this.connectedUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    }
    async handleMessage(client, payload) {
        try {
            const senderId = client.handshake.auth.userId;
            if (!senderId) {
                client.emit('error', { message: 'Authentication required' });
                return;
            }
            const message = await this.chatService.createMessage(senderId, payload.receiverId, payload.message);
            const receiverSocketId = this.connectedUsers.get(payload.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('receive_message', message);
            }
            client.emit('message_sent', { id: message.id, timestamp: message.created_at });
        }
        catch (error) {
            console.error('Message sending error:', error);
            client.emit('error', { message: 'Failed to send message' });
        }
    }
    handleTypingStart(client, payload) {
        const senderId = client.handshake.auth.userId;
        const receiverSocketId = this.connectedUsers.get(payload.receiverId);
        if (receiverSocketId) {
            this.server.to(receiverSocketId).emit('user_typing', {
                userId: senderId,
                isTyping: true,
            });
        }
    }
    handleTypingStop(client, payload) {
        const senderId = client.handshake.auth.userId;
        const receiverSocketId = this.connectedUsers.get(payload.receiverId);
        if (receiverSocketId) {
            this.server.to(receiverSocketId).emit('user_typing', {
                userId: senderId,
                isTyping: false,
            });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing_start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing_stop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTypingStop", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3002, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
        transports: ['websocket', 'polling']
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map