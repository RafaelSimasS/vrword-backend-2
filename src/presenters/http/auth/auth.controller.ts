import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Headers,
  Res,
} from '@nestjs/common';
import { RegisterDto } from '../../../application/user/dto/register.dto';
import { LoginDto } from '../../../application/user/dto/login.dto';
import { RegisterUserUseCase } from '../../../application/user/use-cases/register-user.usecase';
import { LoginUserUseCase } from '../../../application/user/use-cases/login-user.usecase';
import { ValidateTokenUseCase } from '../../../application/user/use-cases/validate-token.usecase';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly validateToken: ValidateTokenUseCase,
  ) {}

  @Post('signup')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.registerUser.execute(dto);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user: result.user };
  }

  @Post('signin')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUser.execute(dto);

    if (result?.accessToken) {
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return { user: result.user };
  }

  // Validate token endpoint: returns user or 401
  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  async validateTokenEndpoint(@Req() req: any) {
    return { user: req.user };
  }

  @Post('validate-token-raw')
  async validateTokenRaw(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');
    const res = await this.validateToken.execute(token);
    if (!res) return { valid: false };
    return { valid: true, user: res };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { ok: true };
  }
}
