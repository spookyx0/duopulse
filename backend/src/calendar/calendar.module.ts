import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { CalendarSchedule } from './calendar-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarSchedule])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}