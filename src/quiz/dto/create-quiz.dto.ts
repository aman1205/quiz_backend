import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ description: 'Title of the quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Category of the quiz', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Description of the quiz', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'List of question IDs' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  questionIds: string[];

  @ApiProperty({ description: 'Time limit in minutes', example: 15 })
  @IsInt()
  @Min(1)
  timeInMinutes: number;

  @ApiProperty({ description: 'Number of participants', example: 0 })
  @IsInt()
  @Min(0)
  participants: number;

  @ApiProperty({
    description: 'Difficulty level of the quiz',
    enum: ['Easy', 'Intermediate', 'Hard'],
  })
  @IsEnum(['Easy', 'Intermediate', 'Hard'])
  difficulty: 'Easy' | 'Intermediate' | 'Hard';

  @ApiProperty({ description: 'Is this quiz featured?', example: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
