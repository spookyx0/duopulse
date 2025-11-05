export declare class CreateCalendarScheduleDto {
    title: string;
    description?: string;
    start_time: Date;
    end_time: Date;
    location?: string;
    is_all_day?: boolean;
}
export declare class UpdateCalendarScheduleDto {
    title?: string;
    description?: string;
    start_time?: Date;
    end_time?: Date;
    location?: string;
    is_all_day?: boolean;
}
