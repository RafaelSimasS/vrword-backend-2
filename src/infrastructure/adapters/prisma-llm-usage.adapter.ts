import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ILlmUsageRepository } from '../../domain/llm/repositories/llm-usage.repository';

@Injectable()
export class PrismaLlmUsageAdapter implements ILlmUsageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyCount(userId: string, date: string): Promise<number> {
    const record = await this.prisma.llmUsage.findUnique({
      where: { userId_date: { userId, date } },
    });
    return record?.count ?? 0;
  }

  async increment(userId: string, date: string): Promise<void> {
    await this.prisma.llmUsage.upsert({
      where: { userId_date: { userId, date } },
      create: { userId, date, count: 1 },
      update: { count: { increment: 1 } },
    });
  }
}
