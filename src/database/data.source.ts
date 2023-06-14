import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

ConfigModule.forRoot();
const config = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_NAME'),
  // entities: ['dist/**/*.entity.js'],
  // migrations: ['dist/db/migrations/*.js'],
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  // synchronize: config.get('NODE_ENV') === 'production' ? false : true,
  // migrationsRun: config.get('NODE_ENV') === 'production' ? true : false,
  synchronize: true,
  migrationsRun: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
}

export const AppDS = new DataSource(DataSourceConfig);