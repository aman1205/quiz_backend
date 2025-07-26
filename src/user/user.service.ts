import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '../core/utils/api-response';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/core/modal/pagination.dto';
import { paginate } from 'src/core/utils/paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<any>> {
    try {
      if (await this.findOneByEmail(createUserDto.email)) {
        return ApiResponse.error<User>(
          'User already exists',
          HttpStatus.BAD_REQUEST,
          'Failed to create user',
        );
      }
      const user = this.usersRepository.create(createUserDto);
      console.log(user);
      await this.usersRepository.save(user);
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload);
      const { password, ...newUser } = user;
      return ApiResponse.success(
        { newUser, accessToken },
        'User created successfully!',
      );
    } catch (error) {
      return ApiResponse.error<User>(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user',
      );
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      // select: ['id', 'email', 'role', 'createdAt'],
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      relations: ['quizSubmissions'],
    });
  }

  async findOne(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        select: ['id', 'name', 'email', 'role', 'createdAt'],
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
        select: ['id', 'name', 'email', 'role', 'createdAt'],
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
  // async findAll(paginationDto: PaginationDto): Promise<ApiResponse<any>> {
  //   try {
  //     const queryBuilder = this.usersRepository.createQueryBuilder('user')
  //       .select(['user.id', 'user.name', 'user.email', 'user.role', 'user.createdAt']);

  //     const result = await paginate(queryBuilder, paginationDto);

  //     return ApiResponse.success(result, 'Users retrieved successfully!');
  //   } catch (error) {
  //     return ApiResponse.error(
  //       error.message,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       'Failed to retrieve users'
  //     );
  //   }
  // }

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
