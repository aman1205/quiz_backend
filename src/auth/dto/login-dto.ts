import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email address of the user', 
    example: 'test1@gmail.com', 
    default: 'test1@gmail.com' // 👈 Explicitly set default for Swagger UI
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string = 'test1@gmail.com';

  @ApiProperty({ 
    description: 'Password for the user account', 
    example: 'Test@123', 
    default: 'Test@123' // 👈 Explicitly set default for Swagger UI
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string = 'Test@123';
}
