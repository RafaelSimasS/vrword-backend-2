import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = 10;

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);
  private readonly saltRounds = Number(
    process.env.BCRYPT_SALT_ROUNDS ?? DEFAULT_SALT_ROUNDS,
  );

  async hash(plain: string): Promise<string> {
    if (!plain) throw new Error('Password empty');
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(plain, salt);
    } catch (err) {
      this.logger.error('Erro ao gerar hash de senha', err);
      throw err;
    }
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    if (!password || !hashed) return false;
    try {
      return await bcrypt.compare(password, hashed);
    } catch (err) {
      this.logger.error('Erro ao comparar senha', err);
      throw err;
    }
  }
}
