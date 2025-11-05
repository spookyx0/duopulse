import { CalendarService } from './calendar.service';
import { CreateCalendarScheduleDto, UpdateCalendarScheduleDto } from './calendar.dto';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
    findAll(req: any): Promise<import("./calendar-schedule.entity").CalendarSchedule[]>;
    getUpcoming(req: any, days: string): Promise<import("./calendar-schedule.entity").CalendarSchedule[]>;
    findOne(id: string, req: any): Promise<import("./calendar-schedule.entity").CalendarSchedule>;
    create(createCalendarDto: CreateCalendarScheduleDto, req: any): Promise<import("./calendar-schedule.entity").CalendarSchedule>;
    update(id: string, updateCalendarDto: UpdateCalendarScheduleDto, req: any): Promise<import("./calendar-schedule.entity").CalendarSchedule>;
    remove(id: string, req: any): Promise<void>;
}
