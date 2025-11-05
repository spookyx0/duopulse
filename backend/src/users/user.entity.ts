import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CalendarSchedule } from '../calendar/calendar-schedule.entity';
import { DailyThought } from '../thoughts/daily-thought.entity';
import { ChatMessage } from '../chat/chat-message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Task, task => task.created_by)
  tasks: Task[];

  @OneToMany(() => CalendarSchedule, schedule => schedule.created_by)
  calendar_schedules: CalendarSchedule[];

  @OneToMany(() => DailyThought, thought => thought.created_by)
  daily_thoughts: DailyThought[];

  @OneToMany(() => ChatMessage, message => message.sender)
  sent_messages: ChatMessage[];

  @OneToMany(() => ChatMessage, message => message.receiver)
  received_messages: ChatMessage[];
}