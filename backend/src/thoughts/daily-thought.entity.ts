import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('daily_thoughts')
export class DailyThought {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ['happy', 'sad', 'excited', 'tired', 'stressed', 'calm', 'productive'],
    default: 'calm'
  })
  mood: string;

  @Column({ default: false })
  is_pinned: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'pinned_by' })
  pinned_by: User;

  @Column({ type: 'timestamp', nullable: true })
  pinned_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}