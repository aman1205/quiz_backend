import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/check')
  @HttpCode(200)
  getHello(): Record<string, string> {
    return { message: 'Hello World!' };
  }
}
