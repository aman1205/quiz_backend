import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '../utils/api-response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      return ApiResponse.success(user, 'User created successfully!');
    } catch (error) {
      return ApiResponse.error<User>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user',
      );
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'role', 'createdAt'],
      relations: ['quizSubmissions'],
    });
  }

  async findOne(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        select: ['id', 'email', 'role', 'createdAt'],
      });
      if (!user) {
        return ApiResponse.error<User>('User not found', HttpStatus.NOT_FOUND);
      }
      return ApiResponse.success(user, 'User retrieved successfully!');
    } catch (error) {
      return ApiResponse.error<User>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve user',
      );
    }
  }

  async findAll(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.usersRepository.find({
        select: ['id', 'email', 'role', 'createdAt'],
      });
      return ApiResponse.success(users, 'Users retrieved successfully!');
    } catch (error) {
      return ApiResponse.error<User[]>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve users',
      );
    }
  }

  //TODO: Implement the update method
  async update(): Promise<ApiResponse<boolean>> {
    try {
      // Implement the update
      return ApiResponse.success(true, 'User updated successfully!');
    } catch (error) {
      return ApiResponse.error<boolean>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update user',
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      await this.usersRepository.delete(id);
      return ApiResponse.success(true, 'User removed successfully!');
    } catch (error) {
      return ApiResponse.error<boolean>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to remove user',
      );
    }
  }
}
