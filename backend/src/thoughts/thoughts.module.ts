import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThoughtsService } from './thoughts.service';
import { ThoughtsController } from './thoughts.controller';
import { DailyThought } from './daily-thought.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyThought])],
  providers: [ThoughtsService],
  controllers: [ThoughtsController],
})
export class ThoughtsModule {}