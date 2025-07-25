import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
    selectedAnswer: string;
}
