import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { QuizSubmission } from './entity/quiz-submission.entity';
import { CreateQuizSubmissionDto } from './dto/create-quizSubmission.dto';
import { ApiResponse } from '../core/utils/api-response';
import { Answer } from './entity/answer.entity';
import { User } from '../user/entity/user.entity';
import { Question } from './../question/entity/question.entity';

@Injectable()
export class QuizSubmissionService {
  constructor(
    @InjectRepository(QuizSubmission)
    private readonly quizSubmissionRepository: Repository<QuizSubmission>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  private async calculateScore(answers: Answer[]): Promise<number> {
    let score = 0;
    for (const answer of answers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
      });
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    }
    return score;
  }

  async createQuizSubmission(createQuizSubmissionDto: CreateQuizSubmissionDto) {
    const { quizId, userId } = createQuizSubmissionDto;

    // Check for existing submission
    const existingSubmission = await this.quizSubmissionRepository.findOne({
      where: { quizId, userId },
    });

    if (existingSubmission) {
      console.log('Duplicate submission detected. Throwing error.');
      throw new HttpException(
        {
          success: false,
          message: 'You have already submitted this quiz.',
          error: 'Duplicate submission not allowed.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const quizSubmission = this.quizSubmissionRepository.create(
        createQuizSubmissionDto,
      );
      await this.quizSubmissionRepository.save(quizSubmission);
      return ApiResponse.success(
        quizSubmission,
        HttpStatus.CREATED,
        'Quiz submission created successfully.',
      );
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred while creating the quiz submission.',
      );
    }
  }

  async findAllQuizSubmissions() {
    const quizSubmissions = await this.quizSubmissionRepository.find();
    return ApiResponse.success(
      quizSubmissions,
      HttpStatus.FOUND,
      'Quiz submissions retrieved successfully.',
    );
  }

  async findOne(id: string) {
    const quizSubmission = await this.quizSubmissionRepository.findOneBy({
      id,
    });
    if (!quizSubmission) {
      throw new NotFoundException('Quiz submission not found');
    }
    return ApiResponse.success(
      quizSubmission,
      'Quiz submission retrieved successfully.',
    );
  }

  async getAllUserScores() {
    const quizSubmissions = await this.quizSubmissionRepository.find({
      relations: {
        answers: true,
      },
    });
    const userIds = Array.from(
      new Set(quizSubmissions.map((submission) => submission.userId)),
    );

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
      select: { id: true, name: true, email: true },
    });
    const userScoresMap: Map<string, number> = new Map();

    await Promise.all(
      quizSubmissions.map(async (submission) => {
        const score = await this.calculateScore(submission.answers);
        const userId = submission.userId.toString();
        userScoresMap.set(userId, (userScoresMap.get(userId) || 0) + score);
      }),
    );

    const leaderboard = Array.from(userScoresMap.entries()).map(
      ([userId, score]) => {
        const user = users.find((u) => u.id === userId);
        return {
          userId,
          username: user?.name,
          email: user?.email,
          score,
        };
      },
    );

    const sortedLeaderboard = leaderboard
      .filter((user) => user.score > 0)
      .sort((a, b) => b.score - a.score);
    return ApiResponse.success(
      sortedLeaderboard,
      HttpStatus.OK,
      'Leaderboard retrieved successfully.',
    );
  }

  async getResponsesByUser(userId: string) {
    const responses = await this.quizSubmissionRepository.find({
      where: { userId },
      relations: ['answers'],
    });

    if (responses.length === 0) {
      throw new NotFoundException('No submissions found for this user');
    }

    const getQuestionWithCorrectAnswer = async (questionId: string) => {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });
      return question?.correctAnswer || null;
    };

    const submissionScores = await Promise.all(
      responses.map(async (submission) => {
        const score = await this.calculateScore(submission.answers);
        const answersWithCorrectAnswers = await Promise.all(
          submission.answers.map(async (answer) => {
            const correctAnswer = await getQuestionWithCorrectAnswer(
              answer.questionId,
            );
            return {
              ...answer,
              correctAnswer,
            };
          }),
        );

        return {
          ...submission,
          answers: answersWithCorrectAnswers,
          score,
        };
      }),
    );

    const totalScore = submissionScores.reduce(
      (total, submission) => total + submission.score,
      0,
    );
    return ApiResponse.success(
      { submissions: submissionScores, totalScore },
      HttpStatus.OK,
      'User responses and scores retrieved successfully.',
    );
  }

  async deleteSubmission(id: string) {
    try {
      const submission = await this.quizSubmissionRepository.findOneBy({ id });
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      await this.quizSubmissionRepository.delete({ id });
      return ApiResponse.success(
        true,
        HttpStatus.OK,
        'Submission deleted successfully.',
      );
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred while deleting submission',
      );
    }
  }

  async deleteAllSubmissions() {
    try {
      await this.answerRepository.createQueryBuilder().delete().execute();
      await this.quizSubmissionRepository
        .createQueryBuilder()
        .delete()
        .execute();
      return ApiResponse.success(
        true,
        HttpStatus.OK,
        'All submissions deleted successfully.',
      );
    } catch (error) {
      return ApiResponse.error(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred while deleting submissions',
      );
    }
  }
}
