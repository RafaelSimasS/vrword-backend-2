import { Injectable } from '@nestjs/common';
import { IDeckRepository } from 'src/domain/deck/repositories/deck.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Deck } from 'generated/prisma/client';

@Injectable()
export class PrismaDeckAdapter implements IDeckRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    title: string;
    description?: string | null;
    userId: string;
  }): Promise<Deck> {
    return this.prisma.deck.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        user: { connect: { id: data.userId } },
      },
    });
  }

  async update(
    id: string,
    data: Partial<{ title: string; description?: string | null }>,
    userId: string,
  ): Promise<Deck | null> {
    const deck = await this.prisma.deck.findUnique({ where: { id } });
    if (!deck || deck.userId !== userId) return null;

    return this.prisma.deck.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    // ensure owner
    const deck = await this.prisma.deck.findUnique({ where: { id } });
    if (!deck || deck.userId !== userId)
      throw new Error('Not found or unauthorized');
    await this.prisma.deck.delete({ where: { id } });
  }

  async findById(id: string, userId?: string): Promise<Deck | null> {
    const deck = await this.prisma.deck.findUnique({ where: { id } });
    if (!deck) return null;
    if (userId && deck.userId !== userId) return null;
    return deck;
  }

  async findAllByUser(userId: string, take = 50, skip = 0): Promise<Deck[]> {
    return this.prisma.deck.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take,
      skip,
    });
  }
}
