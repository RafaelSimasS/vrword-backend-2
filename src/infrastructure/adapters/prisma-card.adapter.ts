// src/infrastructure/adapters/prisma-card.adapter.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICardRepository } from '../../domain/card/repositories/card.repository';
import { Card } from 'generated/prisma/client';

@Injectable()
export class PrismaCardAdapter implements ICardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    front: string;
    back: string;
    deckId: string;
    userId: string;
  }): Promise<Card> {
    const deck = await this.prisma.deck.findUnique({
      where: { id: data.deckId },
    });
    if (!deck) throw new NotFoundException('Deck não encontrado');
    if (deck.userId !== data.userId)
      throw new ForbiddenException('Não autorizado');

    const [card] = await this.prisma.$transaction([
      this.prisma.card.create({
        data: {
          front: data.front,
          back: data.back,
          deck: { connect: { id: data.deckId } },
        },
      }),
      this.prisma.deck.update({
        where: { id: data.deckId },
        data: { cardsCount: { increment: 1 } },
      }),
    ]);

    return card;
  }

  async update(
    id: string,
    data: Partial<{ front: string; back: string }>,
    userId: string,
  ): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) return null;

    const deck = await this.prisma.deck.findUnique({
      where: { id: card.deckId },
    });
    if (!deck) throw new NotFoundException('Deck não encontrado');
    if (deck.userId !== userId) throw new ForbiddenException('Não autorizado');

    return this.prisma.card.update({
      where: { id },
      data: {
        front: data.front ?? undefined,
        back: data.back ?? undefined,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundException('Card não encontrado');

    const deck = await this.prisma.deck.findUnique({
      where: { id: card.deckId },
    });
    if (!deck) throw new NotFoundException('Deck não encontrado');
    if (deck.userId !== userId) throw new ForbiddenException('Não autorizado');

    await this.prisma.$transaction([
      this.prisma.card.delete({ where: { id } }),
      this.prisma.deck.update({
        where: { id: card.deckId },
        data: {
          // prevent negative values
          cardsCount: { decrement: 1 },
        },
      }),
    ]);
  }

  async findById(id: string, userId?: string): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) return null;
    if (userId) {
      const deck = await this.prisma.deck.findUnique({
        where: { id: card.deckId },
      });
      if (!deck) return null;
      if (deck.userId !== userId) return null;
    }
    return card;
  }

  async findAllByDeck(
    deckId: string,
    userId?: string,
    take = 100,
    skip = 0,
  ): Promise<Card[]> {
    if (userId) {
      const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });
      if (!deck) return [];
      if (deck.userId !== userId) return [];
    }
    return this.prisma.card.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' },
      take,
      skip,
    });
  }
}
