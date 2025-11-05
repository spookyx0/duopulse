import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateThoughtDto {
  @IsString()
  content: string;

  @IsEnum(['happy', 'sad', 'excited', 'tired', 'stressed', 'calm', 'productive'])
  @IsOptional()
  mood?: string;
}

export class UpdateThoughtDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['happy', 'sad', 'excited', 'tired', 'stressed', 'calm', 'productive'])
  @IsOptional()
  mood?: string;
}