import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getMessages(partnerId: string, req: any): Promise<import("./chat-message.entity").ChatMessage[]>;
}
