import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { ApiResponse } from '../core/utils/api-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './authGuard/auth.guard';
import { UserGoogleDto } from './dto/user.google.dto';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<any>> {
    return this.authService.login(loginDto);
  }
  // @Post('google/auth')
  // @HttpCode(200)
  // async googleAuth(@Body() userGoogleDto: UserGoogleDto): Promise<ApiResponse<any>> {
  //   return this.authService.googleAuth(userGoogleDto);
  // }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.profile(req.user.sub);
  }
}
