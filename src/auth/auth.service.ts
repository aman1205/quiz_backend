import { Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from '../utils/api-response';
import { LoginDto } from './dto/login-dto';
import {UserGoogleDto } from './dto/user.google.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ApiResponse<any>> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return ApiResponse.success(result, 'User validated successfully');
      }
      return ApiResponse.error(
        null,
        HttpStatus.UNAUTHORIZED,
        'Invalid credentials',
      );
    } catch (error) {
      return ApiResponse.error(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to validate user',
      );
    }
  }

  async login(loginDto: LoginDto): Promise<ApiResponse<any>> {
    const validationResponse = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (validationResponse.success) {
      const payload = {
        email: loginDto.email,
        sub: validationResponse.data.id,
        role: validationResponse.data.role,
      };
      const accessToken = this.jwtService.sign(payload);
      return ApiResponse.success(
        { user: validationResponse.data, access_token: accessToken },
        'Login successful',
      );
    }
    return validationResponse;
  }

  async profile(id: string): Promise<ApiResponse<any>> {
    const user = await this.usersService.findById(id);
    return ApiResponse.success(user, 'User profile retrieved successfully');
  }

  async googleAuth(userGoogleDto: UserGoogleDto): Promise<ApiResponse<any>> {
    try {
      const user = await this.usersService.findOneByEmail(userGoogleDto.email);
      if (!user) {
        return this.usersService.create(userGoogleDto);
      }
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload);
      return ApiResponse.success(
        { user, access_token: accessToken },
        'Login successful',
      );
    } catch (error) {
      return ApiResponse.error<any>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to login',
      );
    }
  }
}
