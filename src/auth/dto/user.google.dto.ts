import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../user/enum/role.enum';

export class UserGoogleDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({ description: 'Role of user' })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
