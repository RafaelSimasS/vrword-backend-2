import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/user/repositories/user.repository';

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        token,
      );
      const user = await this.userRepo.findById(payload.sub);
      if (!user) return null;
      return { id: user.id, email: user.email };
    } catch {
      return null;
    }
  }
}
