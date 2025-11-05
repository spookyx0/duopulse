import { User } from '../users/user.entity';
export declare class CalendarSchedule {
    id: number;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    location: string;
    is_all_day: boolean;
    created_by: User;
    updated_by: User;
    created_at: Date;
    updated_at: Date;
}
