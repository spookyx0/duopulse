import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    findAll(userId: number): Promise<Task[]>;
    findOne(id: number, userId: number): Promise<Task>;
    create(createTaskDto: CreateTaskDto, userId: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task>;
    remove(id: number, userId: number): Promise<void>;
}
