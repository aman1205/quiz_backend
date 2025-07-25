import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizSubmissionService } from './submission.service';
import { CreateQuizSubmissionDto } from './dto/create-quizSubmission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { RolesGuard } from '../auth/roleGuard/roles.guard';
import { Roles } from '../auth/roleGuard/roles.decorator';
import { UserRole } from '../user/enum/role.enum';

@ApiTags('quizsubmission')
@ApiBearerAuth()
@Controller({
  path: 'quizsubmission',
  version: '1',
})
export class QuizSubmissionController {
  constructor(private readonly quizSubmissionService: QuizSubmissionService) {}

  @Post()
  @UseGuards(AuthGuard , RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createQuizSubmission(
    @Body() createQuizSubmissionDto: CreateQuizSubmissionDto,
  ) {
    return await this.quizSubmissionService.createQuizSubmission(
      createQuizSubmissionDto,
    );
  }

  @Get('/leaderboard')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async leaderboard(@Request() req) {
    return await this.quizSubmissionService.getAllUserScores();
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllQuizSubmissions() {
    return await this.quizSubmissionService.findAllQuizSubmissions();
  }

  @Get('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOneQuizSubmission(@Param('id') id: string) {
    return await this.quizSubmissionService.findOne(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeQuizSubmission(@Param('id') id: string) {
    return await this.quizSubmissionService.deleteSubmission(id);
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findUserSubmissions(@Param('id') id: string) {
    return await this.quizSubmissionService.getResponsesByUser(id);
  }

  @Delete()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeAllQuizSubmissions() {
    return await this.quizSubmissionService.deleteAllSubmissions();
  }
}
