import { Controller, Get, Req } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/check')
  getHello( ): string {
   return 'Hello World!';
  }
}
