import { User } from '../users/user.entity';
export declare class ChatMessage {
    id: number;
    message: string;
    sender: User;
    receiver: User;
    is_read: boolean;
    read_at: Date;
    created_at: Date;
}
