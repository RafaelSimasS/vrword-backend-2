// src/application/study/use-cases/review-card.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IStudyRepository,
  STUDY_REPOSITORY,
} from '../../../../src/domain/study/repositories/study.repository';
import { PrismaService } from '../../../../src/infrastructure/prisma/prisma.service';
import { applySm2 } from '../sm2';

@Injectable()
export class ReviewCardUseCase {
  constructor(
    @Inject(STUDY_REPOSITORY)
    private readonly studyRepo: IStudyRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Execute a review:
   * - Find existing StudyProgress or create default
   * - Apply SM-2 update
   * - Persist and return updated StudyProgress
   */
  async execute(input: { userId: string; cardId: string; quality: number }) {
    const { userId, cardId, quality } = input;

    // ensure card exists
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    // use transaction to read/create/update
    return await this.prisma.$transaction(async (tx) => {
      // we cannot use injected studyRepo (uses prisma service) inside tx easily,
      // so do operations with tx directly here for atomicity
      let progress = await tx.studyProgress.findUnique({
        where: { userId_cardId: { userId, cardId } },
      });

      if (!progress) {
        progress = await tx.studyProgress.create({
          data: {
            userId,
            cardId,
            easeFactor: 2.5,
            interval: 0,
            repetition: 0,
            dueDate: new Date(),
            reviewCount: 0,
          },
        });
      }

      const prevState = {
        easeFactor: progress.easeFactor,
        interval: progress.interval,
        repetition: progress.repetition,
      };

      const nextState = applySm2(prevState, quality);

      const now = new Date();
      const nextDue = new Date(now);
      nextDue.setDate(nextDue.getDate() + nextState.interval);

      const updated = await tx.studyProgress.update({
        where: { id: progress.id },
        data: {
          easeFactor: nextState.easeFactor,
          interval: nextState.interval,
          repetition: nextState.repetition,
          dueDate: nextDue,
          lastReviewed: now,
          reviewCount: { increment: 1 },
        },
      });

      return updated;
    });
  }
}
