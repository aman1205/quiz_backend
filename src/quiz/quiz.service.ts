import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quiz } from '../quiz/entity/quiz.entity';
import { Question } from '../question/entity/question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiResponse } from '../core/utils/api-response';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto) {
    const {
      title,
      questionIds,
      category,
      description,
      timeInMinutes,
      participants,
      difficulty,
      featured,
    } = createQuizDto;

    const questions = await this.questionRepository.findBy({
      id: In(questionIds),
    });

    if (!questions.length) {
      throw new NotFoundException('Questions not found');
    }

    const quiz = this.quizRepository.create({
      title,
      category,
      description,
      timeInMinutes,
      participants,
      difficulty,
      featured,
      questionsList: questions,
    });

    await this.quizRepository.save(quiz);

    return ApiResponse.success(
      quiz,
      HttpStatus.CREATED,
      'Quiz created successfully',
    );
  }

  async findAllQuizzes() {
    const quizzes = await this.quizRepository.find({
      relations: ['questionsList'],
      select: {
        questionsList: {
          id: true,
          text: true,
          options: true,
          category: true,
        },
      },
      order: {
        featured: 'DESC',
      },
    });

    return ApiResponse.success(
      quizzes,
      HttpStatus.OK,
      'Quizzes fetched successfully',
    );
  }

  async findOne(id: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questionsList'],
      select: {
        questionsList: {
          id: true,
          text: true,
          options: true,
          category: true,
          image_url: true,
        },
      },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return ApiResponse.success(
      quiz,
      HttpStatus.OK,
      'Quiz fetched successfully',
    );
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questionsList'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (updateQuizDto.title) quiz.title = updateQuizDto.title;
    if (updateQuizDto.category) quiz.category = updateQuizDto.category;
    if (updateQuizDto.description) quiz.description = updateQuizDto.description;
    if (updateQuizDto.timeInMinutes !== undefined)
      quiz.timeInMinutes = updateQuizDto.timeInMinutes;
    if (updateQuizDto.participants !== undefined)
      quiz.participants = updateQuizDto.participants;
    if (updateQuizDto.difficulty) quiz.difficulty = updateQuizDto.difficulty;
    if (updateQuizDto.featured !== undefined)
      quiz.featured = updateQuizDto.featured;

    if (updateQuizDto.questionIds) {
      const questions = await this.questionRepository.findBy({
        id: In(updateQuizDto.questionIds),
      });

      if (!questions.length) {
        throw new NotFoundException('Invalid questions provided');
      }

      quiz.questionsList = questions;
    }

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
      HttpStatus.OK,
      'Quiz deleted successfully',
    );
  }
}
