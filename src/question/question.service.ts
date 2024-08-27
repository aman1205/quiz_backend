import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entity/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiResponse } from '../utils/api-response';
import * as csvParser from 'csv-parser';
  import { Readable } from 'stream';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
  ): Promise<ApiResponse<Question>> {
    try {
      const { text, category, correctAnswer, options } = createQuestionDto;

      if (!options || options.length === 0) {
        return ApiResponse.error(
          'Options cannot be empty',
          HttpStatus.BAD_REQUEST,
          'Failed to create question',
        );
      }
      if (!options.includes(correctAnswer)) {
        return ApiResponse.error(
          'Correct answer must be one of the provided options',
          HttpStatus.BAD_REQUEST,
          'Failed to create question',
        );
      }

      const question = this.questionRepository.create({
        text,
        category,
        correctAnswer,
        options,
      });
      await this.questionRepository.save(question);

      return ApiResponse.success(question, 'Question created successfully');
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.BAD_REQUEST,
        'Failed to create question',
      );
    }
  }

  async findAll(): Promise<ApiResponse<Question[]>> {
    try {
      const questions = await this.questionRepository.find();
      return ApiResponse.success(questions, 'Questions retrieved successfully');
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve questions',
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Question>> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id },
      });

      if (!question) {
        return ApiResponse.error(
          `Question with ID ${id} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return ApiResponse.success(question, 'Question retrieved successfully');
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve question',
      );
    }
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<ApiResponse<Question>> {
    try {
      const questionResponse = await this.findOne(id);

      if (!questionResponse.data) {
        return questionResponse;
      }

      const question = questionResponse.data;
      question.text = updateQuestionDto.text ?? question.text;
      question.category = updateQuestionDto.category ?? question.category;
      question.correctAnswer =
        updateQuestionDto.correctAnswer ?? question.correctAnswer;
      question.options = updateQuestionDto.options ?? question.options;
      await this.questionRepository.save(question);
      return ApiResponse.success(question, 'Question updated successfully');
    } catch (error) {
      return ApiResponse.error(
        null,
        HttpStatus.BAD_REQUEST,
        'Failed to update question',
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      this.questionRepository.delete(id);
      return ApiResponse.success(null, 'Question removed successfully');
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to remove question',
      );
    }
  }

  async deleteAll(): Promise<ApiResponse<boolean>> {
    try {
      await this.questionRepository.clear();
      return ApiResponse.success(null, 'All questions deleted successfully');
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete all questions',
      );
    }
  }

  async createMultiple(
    createQuestionsDto: CreateQuestionDto[],
  ): Promise<ApiResponse<Question[]>> {
    try {
      const questions: Question[] = [];
  
      for (const createQuestionDto of createQuestionsDto) {
        const { text, category, correctAnswer, options } = createQuestionDto;
  
        if (!options || options.length === 0) {
          return ApiResponse.error(
            'Options cannot be empty',
            HttpStatus.BAD_REQUEST,
            'Failed to create questions',
          );
        }
        if (!options.includes(correctAnswer)) {
          return ApiResponse.error(
            'Correct answer must be one of the provided options',
            HttpStatus.BAD_REQUEST,
            'Failed to create questions',
          );
        }
  
        const question = this.questionRepository.create({
          text,
          category,
          correctAnswer,
          options,
        });
        questions.push(question);
      }
  
      await this.questionRepository.save(questions);
      return ApiResponse.success(questions, 'Questions created successfully');
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.BAD_REQUEST,
        'Failed to create questions',
      );
    }
  }
  
  async uploadFromCsv(file: Express.Multer.File): Promise<ApiResponse<Question[]>> {
    try {
      const questions: CreateQuestionDto[] = [];
      const stream = Readable.from(file.buffer);
      
      return new Promise((resolve, reject) => {
        stream
          .pipe(csvParser())
          .on('data', (row) => {
            const { text, category, correctAnswer, options } = row;
            const questionDto: CreateQuestionDto = {
              text,
              category,
              correctAnswer,
              options: options.split(';'), // assuming options are separated by ';' in the CSV
            };
            questions.push(questionDto);
          })
          .on('end', async () => {
            const response = await this.createMultiple(questions);
            resolve(response);
          })
          .on('error', (error) => {
            reject(
              ApiResponse.error(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Failed to upload questions from CSV',
              ),
            );
          });
      });
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to upload questions from CSV',
      );
    }
  }
}
