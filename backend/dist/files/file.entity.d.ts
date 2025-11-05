import { User } from '../users/user.entity';
export declare class File {
    id: number;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    mime_type: string;
    description: string;
    created_by: User;
    updated_by: User;
    created_at: Date;
    updated_at: Date;
}
