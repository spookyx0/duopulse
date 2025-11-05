import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateCalendarScheduleDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  start_time: Date;

  @IsDateString()
  end_time: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  is_all_day?: boolean;
}

export class UpdateCalendarScheduleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  start_time?: Date;

  @IsDateString()
  @IsOptional()
  end_time?: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  is_all_day?: boolean;
}