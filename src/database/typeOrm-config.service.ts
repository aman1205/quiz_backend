import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('DATABASE_TYPE'),
      url: this.configService.get<string>('DATABASE_URL'),
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      synchronize: this.configService.get<boolean>('DATABASE_SYNCHRONIZE'),
      schema: this.configService.get<string>('DATABASE_SCHEMA'),
      autoLoadEntities: true,
      dropSchema: false,
      keepConnectionAlive: false,
      logging: this.configService.get<string>('NODE_ENV') !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        max: this.configService.get<number>('DATABASE_MAX_CONNECTIONS'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
    } as TypeOrmModuleOptions;
  }
}