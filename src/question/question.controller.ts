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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { RolesGuard } from '../auth/roleGuard/roles.guard';
import { Roles } from '../auth/roleGuard/roles.decorator';
import { UserRole } from '../user/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload-dto';

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

  @Post('/bulk')
  @HttpCode(201)
  @ApiBody({ type: [CreateQuestionDto] })
  async createBulk(@Body() body: CreateQuestionDto[]) {
    return await this.questionService.createMultiple(body);
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

  @Delete()
  async removeAll() {
    return await this.questionService.deleteAll();
  }
  @Get('/sub/categorys')
  @HttpCode(201)
  async getCategoies() {
    console.log('kgneroigbe');
    return await this.questionService.getCategory();
  }

  @Post('/upload')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload the List of Questions within a CSV file',
    type: FileUploadDto,
  })
  async uploadFile(@UploadedFile() file) {
    return await this.questionService.uploadFromCsv(file);
  }
}
