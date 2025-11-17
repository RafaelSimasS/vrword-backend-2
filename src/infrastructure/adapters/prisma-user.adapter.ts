import { Injectable } from '@nestjs/common';

import { IUserRepository } from '../../domain/user/repositories/user.repository';
import { UserEntity } from '../../domain/user/entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

interface PrismaUserRow {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaUserAdapter implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private map(row: PrismaUserRow | null): UserEntity | null {
    if (!row) return null;
    return new UserEntity(
      row.id,
      row.email,
      row.password,
      row.createdAt,
      row.updatedAt,
    );
  }

  async create(data: { email: string; password: string }): Promise<UserEntity> {
    const row = (await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    })) as PrismaUserRow;
    return this.map(row)!;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = (await this.prisma.user.findUnique({
      where: { email },
    })) as PrismaUserRow | null;
    return this.map(row);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const row = (await this.prisma.user.findUnique({
      where: { id },
    })) as PrismaUserRow | null;
    return this.map(row);
  }
}
