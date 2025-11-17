import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/user/repositories/user.repository';
import { PasswordService } from '../services/password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.passwordService.compare(
      input.password,
      user.password,
    );
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token: string = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: { id: user.id, email: user.email },
    };
  }
}
