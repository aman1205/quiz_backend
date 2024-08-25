import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { QuizSubmission } from '../submission/entity/quiz-submission.entity';
import { Answer } from '../submission/entity/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, QuizSubmission, Answer])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
