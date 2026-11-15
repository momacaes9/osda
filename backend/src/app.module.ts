import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from './config/environmentVariables.js';
import { AppController } from './app.controller.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthenticationModule } from './modules/authentication/authentication.module.js';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module.js';
import { AiModule } from './modules/ai/ai.module.js';
import { User } from './modules/users/entities/user.entity.js';
import { UserAuthentication } from './modules/authentication/entities/userAuthentication.entity.js';
import { Questionnaire } from './modules/questionnaire/questionnaire.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>(EnvironmentVariables.DATABASE_URL);
        if (!url) throw new Error('DATABASE_URL is not set');
        const ssl =
          config.get<string>(EnvironmentVariables.DATABASE_SSL) === 'true' ||
          /sslmode=require/.test(url);
        return {
          type: 'postgres' as const,
          url,
          ssl: ssl ? { rejectUnauthorized: false } : false,
          entities: [User, UserAuthentication, Questionnaire],
          // Creates/updates tables automatically. Set DATABASE_SYNCHRONIZE=false once you add migrations.
          synchronize: config.get<string>(EnvironmentVariables.DATABASE_SYNCHRONIZE) !== 'false',
          extra: { max: 5 },
        };
      },
    }),
    UsersModule,
    AuthenticationModule,
    QuestionnaireModule,
    AiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
