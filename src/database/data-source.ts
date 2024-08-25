import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  // synchronize: true,
  dropSchema: false,
  keepConnectionAlive: true,
  ssl: {
    rejectUnauthorized: false, // This ignores SSL certificate validation. Set to true in production if you have a valid certificate.
  },
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    max: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
  },
} as DataSourceOptions);
