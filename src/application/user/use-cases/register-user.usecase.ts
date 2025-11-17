import { Injectable, ConflictException, Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/user/repositories/user.repository';
import { PasswordService } from '../services/password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: { email: string; password: string }) {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await this.passwordService.hash(input.password);
    const user = await this.userRepo.create({
      email: input.email,
      password: hashed,
    });

    const payload = { sub: user.id, email: user.email };
    const token: string = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
