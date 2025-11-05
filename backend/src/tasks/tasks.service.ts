import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { created_by: { id: userId } },
      relations: ['created_by', 'updated_by'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, created_by: { id: userId } },
      relations: ['created_by', 'updated_by'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      created_by: { id: userId },
      updated_by: { id: userId },
    });

    return await this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    
    const updatedTask = {
      ...task,
      ...updateTaskDto,
      updated_by: { id: userId },
    };

    return await this.tasksRepository.save(updatedTask);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }
}