import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarSchedule } from './calendar-schedule.entity';
import { CreateCalendarScheduleDto, UpdateCalendarScheduleDto } from './calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarSchedule)
    private calendarRepository: Repository<CalendarSchedule>,
  ) {}

  async findAll(userId: number): Promise<CalendarSchedule[]> {
    return this.calendarRepository.find({
      where: { created_by: { id: userId } },
      relations: ['created_by', 'updated_by'],
      order: { start_time: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<CalendarSchedule> {
    const schedule = await this.calendarRepository.findOne({
      where: { id, created_by: { id: userId } },
      relations: ['created_by', 'updated_by'],
    });

    if (!schedule) {
      throw new NotFoundException('Calendar schedule not found');
    }

    return schedule;
  }

  async create(createCalendarDto: CreateCalendarScheduleDto, userId: number): Promise<CalendarSchedule> {
    const schedule = this.calendarRepository.create({
      ...createCalendarDto,
      created_by: { id: userId },
      updated_by: { id: userId },
    });

    return await this.calendarRepository.save(schedule);
  }

  async update(id: number, updateCalendarDto: UpdateCalendarScheduleDto, userId: number): Promise<CalendarSchedule> {
    const schedule = await this.findOne(id, userId);
    
    Object.assign(schedule, {
      ...updateCalendarDto,
      updated_by: { id: userId },
    });

    return await this.calendarRepository.save(schedule);
  }

  async remove(id: number, userId: number): Promise<void> {
    const schedule = await this.findOne(id, userId);
    await this.calendarRepository.remove(schedule);
  }

  async getUpcoming(userId: number, days: number = 7): Promise<CalendarSchedule[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    return this.calendarRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.created_by', 'created_by')
      .leftJoinAndSelect('schedule.updated_by', 'updated_by')
      .where('schedule.created_by = :userId', { userId })
      .andWhere('schedule.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('schedule.start_time', 'ASC')
      .getMany();
  }
}