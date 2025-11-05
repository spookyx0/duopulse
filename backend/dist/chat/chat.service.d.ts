import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
export declare class ChatService {
    private chatMessageRepository;
    constructor(chatMessageRepository: Repository<ChatMessage>);
    createMessage(senderId: number, receiverId: number, message: string): Promise<ChatMessage>;
    getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<ChatMessage[]>;
    markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
}
