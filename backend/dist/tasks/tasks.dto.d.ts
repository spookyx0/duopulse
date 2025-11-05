export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: Date;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: Date;
}
