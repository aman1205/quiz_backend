import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { RolesGuard } from '../auth/roleGuard/roles.guard';
import { Roles } from '../auth/roleGuard/roles.decorator';
import { UserRole } from '../user/enum/role.enum';

@ApiTags('question')
@ApiBearerAuth()
@Controller({
  path: 'question',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateQuestionDto) {
    return await this.questionService.create(body);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.questionService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.questionService.findAll();
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateQuestionDto) {
    return await this.questionService.update(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.questionService.remove(id);
  }
}
