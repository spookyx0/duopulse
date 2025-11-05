import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyThought } from './daily-thought.entity';
import { CreateThoughtDto, UpdateThoughtDto } from './thoughts.dto';

@Injectable()
export class ThoughtsService {
  constructor(
    @InjectRepository(DailyThought)
    private thoughtsRepository: Repository<DailyThought>,
  ) {}

  async findAll(userId: number): Promise<DailyThought[]> {
    return this.thoughtsRepository.find({
      where: { created_by: { id: userId } },
      relations: ['created_by', 'updated_by', 'pinned_by'],
      order: { created_at: 'DESC' },
    });
  }

  async findPinned(userId: number): Promise<DailyThought[]> {
    return this.thoughtsRepository.find({
      where: { is_pinned: true },
      relations: ['created_by', 'updated_by', 'pinned_by'],
      order: { pinned_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<DailyThought> {
    const thought = await this.thoughtsRepository.findOne({
      where: { id, created_by: { id: userId } },
      relations: ['created_by', 'updated_by', 'pinned_by'],
    });

    if (!thought) {
      throw new NotFoundException('Thought not found');
    }

    return thought;
  }

  async create(createThoughtDto: CreateThoughtDto, userId: number): Promise<DailyThought> {
    const thought = this.thoughtsRepository.create({
      ...createThoughtDto,
      created_by: { id: userId },
      updated_by: { id: userId },
    });

    return await this.thoughtsRepository.save(thought);
  }

  async update(id: number, updateThoughtDto: UpdateThoughtDto, userId: number): Promise<DailyThought> {
    const thought = await this.findOne(id, userId);
    
    const updatedThought = {
      ...thought,
      ...updateThoughtDto,
      updated_by: { id: userId },
    };

    return await this.thoughtsRepository.save(updatedThought);
  }

  async pinThought(id: number, userId: number): Promise<DailyThought> {
    const thought = await this.findOne(id, userId);
    
    thought.is_pinned = true;
    thought.pinned_by = { id: userId } as any;
    thought.pinned_at = new Date();
    thought.updated_by = { id: userId } as any;

    return await this.thoughtsRepository.save(thought);
  }

  async unpinThought(id: number, userId: number): Promise<DailyThought> {
    const thought = await this.findOne(id, userId);
    
    thought.is_pinned = false;
    thought.pinned_by = null;
    thought.pinned_at = null;
    thought.updated_by = { id: userId } as any;

    return await this.thoughtsRepository.save(thought);
  }

  async remove(id: number, userId: number): Promise<void> {
    const thought = await this.findOne(id, userId);
    await this.thoughtsRepository.remove(thought);
  }
}