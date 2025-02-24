import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Quiz } from '../../quiz/entity/quiz.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  category: string;

  @Column({nullable:true})
  image_url:string

  @Column('simple-array')
  options: string[];

  @Column()
  correctAnswer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Quiz, (quiz) => quiz.questions , {cascade: true})
  quizzes: Quiz[];
}
