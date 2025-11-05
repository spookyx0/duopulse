import { User } from '../users/user.entity';
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: Date;
    created_by: User;
    updated_by: User;
    created_at: Date;
    updated_at: Date;
}
