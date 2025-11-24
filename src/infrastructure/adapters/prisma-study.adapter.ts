// src/infrastructure/adapters/prisma-study.adapter.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IStudyRepository } from '../../domain/study/repositories/study.repository';
import { StudyProgress } from 'generated/prisma/client';

@Injectable()
export class PrismaStudyAdapter implements IStudyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCardAndUser(
    cardId: string,
    userId: string,
  ): Promise<StudyProgress | null> {
    return this.prisma.studyProgress.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });
  }

  async create(data: {
    userId: string;
    cardId: string;
    easeFactor?: number;
    interval?: number;
    repetition?: number;
    dueDate?: Date;
  }): Promise<StudyProgress> {
    return this.prisma.studyProgress.create({
      data: {
        userId: data.userId,
        cardId: data.cardId,
        easeFactor: data.easeFactor ?? 2.5,
        interval: data.interval ?? 0,
        repetition: data.repetition ?? 0,
        dueDate: data.dueDate ?? new Date(),
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      easeFactor: number;
      interval: number;
      repetition: number;
      dueDate: Date;
      lastReviewed: Date;
      reviewCount: number;
    }>,
  ): Promise<StudyProgress> {
    return this.prisma.studyProgress.update({
      where: { id },
      data: {
        easeFactor: data.easeFactor ?? undefined,
        interval: data.interval ?? undefined,
        repetition: data.repetition ?? undefined,
        dueDate: data.dueDate ?? undefined,
        lastReviewed: data.lastReviewed ?? undefined,
        reviewCount: data.reviewCount ?? undefined,
      },
    });
  }

  /**
   * Find due StudyProgress rows for a user (optionally filtered by deckId).
   * Due = dueDate <= now
   */
  async findDueByDeck(
    userId: string,
    deckId?: string,
    limit = 20,
  ): Promise<any[]> {
    const now = new Date();

    // 1) existing progress due
    const dueProgress = await this.prisma.studyProgress.findMany({
      where: {
        userId,
        dueDate: { lte: now },
        ...(deckId ? { card: { deckId } } : {}),
      },
      include: { card: true },
      orderBy: { dueDate: 'asc' },
      take: limit,
    });

    // if we already have enough results, return them
    if (dueProgress.length >= limit) {
      return dueProgress.slice(0, limit);
    }

    // 2) find cards in the deck that do NOT have a progress row for this user
    // get ids of cards that already have any progress for this user
    const progressCards = await this.prisma.studyProgress.findMany({
      where: { userId },
      select: { cardId: true },
    });
    const progressCardIds = new Set(progressCards.map((p) => p.cardId));

    // fetch candidate cards (either all deck cards or all cards if no deckId)
    const cards = await this.prisma.card.findMany({
      where: {
        ...(deckId ? { deckId } : {}),
        // only pick cards that don't have progress for this user
        AND: [{ id: { notIn: Array.from(progressCardIds) } }],
      },
      orderBy: { createdAt: 'asc' },
      take: Math.max(0, limit - dueProgress.length),
    });

    // map those cards to StudyProgress-like objects (in-memory defaults)
    const defaultProgressItems = cards.map((card) => ({
      // create a synthetic id so it is unique-ish — this is just for transport to client
      id: `init-${card.id}`,
      userId,
      cardId: card.id,
      easeFactor: 2.5,
      interval: 0,
      repetition: 0,
      dueDate: now, // treat as due now
      lastReviewed: null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
      card, // include the card data
    }));

    // combine and return sorted by dueDate (dueProgress may have older dueDates)
    const combined = [...dueProgress, ...defaultProgressItems];
    combined.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

    return combined.slice(0, limit);
  }
}
