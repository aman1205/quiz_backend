import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Question } from '../../question/entity/question.entity';
import { QuizSubmission } from '../../submission/entity/quiz-submission.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => Question, (question) => question.quizzes)
  @JoinTable() // This creates a join table to manage the many-to-many relationship
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuizSubmission, (quizSubmission) => quizSubmission.quiz)
  quizSubmissions: QuizSubmission[];
}
