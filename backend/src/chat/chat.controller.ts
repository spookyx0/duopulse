import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/:partnerId')
  async getMessages(@Param('partnerId') partnerId: string, @Request() req) {
    return this.chatService.getMessagesBetweenUsers(req.user.userId, +partnerId);
  }
}