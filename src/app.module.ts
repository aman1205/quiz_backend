import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { QuizModule } from './quiz/quiz.module';
import { SubmissionModule } from './submission/submission.module';
import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './database/typeOrm-config.service';
import { AppController } from './app.controller';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        max: configService.get<number>('redis.max'),
        ttl: configService.get<number>('redis.ttl'),
        isGlobal: true,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 5000, // Time to live in milliseconds
        limit: 20,  // Maximum number of requests within the ttl
      },

    ]),
    UserModule,
    AuthModule,
    QuestionModule,
    QuizModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
