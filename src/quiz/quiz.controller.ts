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
  UseInterceptors,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { RolesGuard } from '../auth/roleGuard/roles.guard';
import { Roles } from '../auth/roleGuard/roles.decorator';
import { UserRole } from '../user/enum/role.enum';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@ApiTags('quiz')
@Controller('quiz')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    const response = await this.quizService.createQuiz(createQuizDto);
    return response;
  }

  @Get()
  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('findAllQuizzes')
  @HttpCode(HttpStatus.OK)
  async findAllQuizzes() {
    const response = await this.quizService.findAllQuizzes();
    return response;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneQuiz(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.quizService.findOne(id);
    return response;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateQuiz(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    const response = await this.quizService.updateQuiz(id, updateQuizDto);
    return response;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeQuiz(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.quizService.removeQuiz(id);
    return response;
  }
}
