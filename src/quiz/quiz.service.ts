import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../quiz/entity/quiz.entity';
import { Question } from '../question/entity/question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiResponse } from '../core/utils/api-response';
import { In } from 'typeorm';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) { }

  async createQuiz(createQuizDto: CreateQuizDto) {
    const { title, questionIds } = createQuizDto;
    const questions = await this.questionRepository.findBy({
      id: In(questionIds),
    });
    if (!questions.length) {
      throw new NotFoundException('Questions not found');
    }
    const quiz = this.quizRepository.create({ title, questions });
    await this.quizRepository.save(quiz);

    return ApiResponse.success(
      quiz,
      HttpStatus.CREATED,
      'Quiz created successfully',
    );
  }

  async findAllQuizzes() {
    const quizzes = await this.quizRepository.find({
      relations: ['questions'],
    });
    return ApiResponse.success(
      quizzes,
      HttpStatus.FOUND,
      'Quizzes fetched successfully',
    );
  }

  async findOne(id: string) {
    const quiz = await this.quizRepository.find({
      where: { id },
      relations: ['questions'],
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return ApiResponse.success(quiz, 'Quiz fetched successfully');
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    quiz.title = updateQuizDto.title;
    const questions = await this.questionRepository.findBy({
      id: In(updateQuizDto.questionIds),
    });
    quiz.questions = questions;
    const updatedQuiz = await this.quizRepository.save(quiz);
    return ApiResponse.success(
      updatedQuiz,
      HttpStatus.OK,
      'Quiz updated successfully',
    );
  }

  async removeQuiz(id: string) {
    const result = await this.quizRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Quiz not found');
    }
    return ApiResponse.success(
      true,
      HttpStatus.ACCEPTED,
      'Quiz deleted successfully',
    );
  }
}
