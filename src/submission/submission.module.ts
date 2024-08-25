import { Module } from '@nestjs/common';
import { QuizSubmissionController } from './submission.controller';
import { QuizSubmissionService } from './submission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSubmission } from './entity/quiz-submission.entity';
import { Answer } from './entity/answer.entity';
import { User } from '../user/entity/user.entity';
import { Question } from 'src/question/entity/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizSubmission, Answer, User, Question])],
  controllers: [QuizSubmissionController],
  providers: [QuizSubmissionService],
})
export class SubmissionModule {}
