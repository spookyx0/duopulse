import { User } from '../users/user.entity';
export declare class DailyThought {
    id: number;
    content: string;
    mood: string;
    is_pinned: boolean;
    pinned_by: User;
    pinned_at: Date;
    created_by: User;
    updated_by: User;
    created_at: Date;
    updated_at: Date;
}
