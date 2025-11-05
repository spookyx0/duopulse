import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  due_date?: Date;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  due_date?: Date;
}