import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { RolesGuard } from '../auth/roleGuard/roles.guard';
import { Roles } from '../auth/roleGuard/roles.decorator';
import { UserRole } from '../user/enum/role.enum';

@ApiTags('user')
@ApiBearerAuth()
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(201)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}