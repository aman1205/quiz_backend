import { IsUUID, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { AnswerDto } from './answer.dto'; // Assuming there's an AnswerDto for the answers
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizSubmissionDto {
  @ApiProperty({ description: 'Id of the quiz' })
  @IsUUID()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ description: 'Id of the user' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Array of answers' })
  @IsArray()
  @ArrayNotEmpty()
  answers: AnswerDto[];
}
