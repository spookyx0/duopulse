import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createMessage(senderId: number, receiverId: number, message: string): Promise<ChatMessage> {
    const chatMessage = this.chatMessageRepository.create({
      message,
      sender: { id: senderId },
      receiver: { id: receiverId },
    });

    return await this.chatMessageRepository.save(chatMessage);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<ChatMessage[]> {
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

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    await this.chatMessageRepository
      .createQueryBuilder()
      .update(ChatMessage)
      .set({ is_read: true, read_at: new Date() })
      .where('sender_id = :senderId AND receiver_id = :receiverId AND is_read = false')
      .setParameters({ senderId, receiverId })
      .execute();
  }
}