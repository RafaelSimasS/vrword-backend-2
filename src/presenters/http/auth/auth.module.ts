import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { PrismaUserAdapter } from '../../../infrastructure/adapters/prisma-user.adapter';
import { PasswordService } from '../../../application/user/services/password.service';
import { RegisterUserUseCase } from '../../../application/user/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../../application/user/use-cases/login-user.usecase';
import { ValidateTokenUseCase } from '../../../application/user/use-cases/validate-token.usecase';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { JwtStrategy } from '../guards/jwt.strategy';
import { USER_REPOSITORY } from 'src/domain/user/repositories/user.repository';
import { JwtCookieAuthGuard } from '../guards/jwt-cookie.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            config.get<string>('JWT_EXPIRES_IN') || '3600',
            10,
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaUserAdapter,
    PasswordService,
    RegisterUserUseCase,
    LoginUserUseCase,
    ValidateTokenUseCase,
    JwtStrategy,
    JwtCookieAuthGuard,
    { provide: USER_REPOSITORY, useExisting: PrismaUserAdapter },
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtCookieAuthGuard,
    RegisterUserUseCase,
    LoginUserUseCase,
    ValidateTokenUseCase,
  ],
})
export class AuthModule {}
