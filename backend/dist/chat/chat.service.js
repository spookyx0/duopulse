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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_message_entity_1 = require("./chat-message.entity");
let ChatService = class ChatService {
    constructor(chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }
    async createMessage(senderId, receiverId, message) {
        const chatMessage = this.chatMessageRepository.create({
            message,
            sender: { id: senderId },
            receiver: { id: receiverId },
        });
        return await this.chatMessageRepository.save(chatMessage);
    }
    async getMessagesBetweenUsers(user1Id, user2Id) {
        return this.chatMessageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('(message.sender_id = :user1Id AND message.receiver_id = :user2Id)')
            .orWhere('(message.sender_id = :user2Id AND message.receiver_id = :user1Id)')
            .setParameters({ user1Id, user2Id })
            .orderBy('message.created_at', 'ASC')
            .getMany();
    }
    async markMessagesAsRead(senderId, receiverId) {
        await this.chatMessageRepository
            .createQueryBuilder()
            .update(chat_message_entity_1.ChatMessage)
            .set({ is_read: true, read_at: new Date() })
            .where('sender_id = :senderId AND receiver_id = :receiverId AND is_read = false')
            .setParameters({ senderId, receiverId })
            .execute();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map