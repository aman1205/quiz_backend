import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Quiz } from '../../quiz/entity/quiz.entity';
import { User } from '../../user/entity/user.entity';
import { Answer } from './answer.entity';

@Entity()
@Unique(['userId', 'quizId'])
export class QuizSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizSubmissions)
  quiz: Quiz;

  @Column()
  quizId: string;

  @ManyToOne(() => User, (user) => user.quizSubmissions)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Answer, (answer) => answer.quizSubmission, { cascade: true })
  answers: Answer[];

  @CreateDateColumn()
  submittedAt: Date;
}
