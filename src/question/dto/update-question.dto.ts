import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  options?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  image_url?: string;
}
