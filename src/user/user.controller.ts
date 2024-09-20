import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { findByEmailDto } from './dto/find-by-email.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/authGuard/auth.guard';
import { RolesGuard } from '../auth/roleGuard/roles.guard';
import { Roles } from '../auth/roleGuard/roles.decorator';
import { UserRole } from '../user/enum/role.enum';
import { ApiResponse } from '../utils/api-response';


@ApiTags('user')
@ApiBearerAuth()
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  @HttpCode(201)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }
  @UseGuards(AuthGuard)
  @Get('/userdetails/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Get('/email')
  async findByEmail(@Query('email') email: string) {
    const user= await this.userService.findOneByEmail(email);
    return ApiResponse.success(user, 'User found successfully!');
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/findall')
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