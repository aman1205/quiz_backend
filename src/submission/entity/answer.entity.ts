import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { QuizSubmission } from './quiz-submission.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionId: string;

  @Column()
  selectedAnswer: string;

  @ManyToOne(() => QuizSubmission, (quizSubmission) => quizSubmission.answers)
  quizSubmission: QuizSubmission;

  @Column()
  quizSubmissionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
