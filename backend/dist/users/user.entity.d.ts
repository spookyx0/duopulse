import { Task } from '../tasks/task.entity';
import { CalendarSchedule } from '../calendar/calendar-schedule.entity';
import { DailyThought } from '../thoughts/daily-thought.entity';
import { ChatMessage } from '../chat/chat-message.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    avatar_url: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    tasks: Task[];
    calendar_schedules: CalendarSchedule[];
    daily_thoughts: DailyThought[];
    sent_messages: ChatMessage[];
    received_messages: ChatMessage[];
}
