import { Repository } from 'typeorm';
import { CalendarSchedule } from './calendar-schedule.entity';
import { CreateCalendarScheduleDto, UpdateCalendarScheduleDto } from './calendar.dto';
export declare class CalendarService {
    private calendarRepository;
    constructor(calendarRepository: Repository<CalendarSchedule>);
    findAll(userId: number): Promise<CalendarSchedule[]>;
    findOne(id: number, userId: number): Promise<CalendarSchedule>;
    create(createCalendarDto: CreateCalendarScheduleDto, userId: number): Promise<CalendarSchedule>;
    update(id: number, updateCalendarDto: UpdateCalendarScheduleDto, userId: number): Promise<CalendarSchedule>;
    remove(id: number, userId: number): Promise<void>;
    getUpcoming(userId: number, days?: number): Promise<CalendarSchedule[]>;
}
