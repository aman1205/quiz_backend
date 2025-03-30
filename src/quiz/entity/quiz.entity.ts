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

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;


  @Column({ default: 10 })
  timeInMinutes: number;

  @Column({ default: 0 })
  participants: number;

  @Column({ type: 'enum', enum: ['Easy', 'Intermediate', 'Hard'], default: 'Easy' })
  difficulty: 'Easy' | 'Intermediate' | 'Hard';

  @Column({ default: false })
  featured: boolean;

  @ManyToMany(() => Question, (question) => question.quizzes)
  @JoinTable()
  questionsList: Question[];

  @OneToMany(() => QuizSubmission, (quizSubmission) => quizSubmission.quiz)
  quizSubmissions: QuizSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
