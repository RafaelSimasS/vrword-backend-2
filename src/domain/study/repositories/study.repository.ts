// src/domain/study/repositories/study.repository.ts
import { StudyProgress } from 'generated/prisma/client';

export const STUDY_REPOSITORY = 'StudyRepository';

export interface IStudyRepository {
  findByCardAndUser(
    cardId: string,
    userId: string,
  ): Promise<StudyProgress | null>;
  create(data: {
    userId: string;
    cardId: string;
    easeFactor?: number;
    interval?: number;
    repetition?: number;
    dueDate?: Date;
  }): Promise<StudyProgress>;
  update(
    id: string,
    data: Partial<{
      easeFactor: number;
      interval: number;
      repetition: number;
      dueDate: Date;
      lastReviewed: Date;
      reviewCount: number;
    }>,
  ): Promise<StudyProgress>;

  findDueByDeck(
    userId: string,
    deckId?: string,
    limit?: number,
  ): Promise<StudyProgress[]>;

  /**
   * Returns the earliest dueDate that is strictly in the future (> now) for
   * this user (optionally filtered by deckId).  Returns null when none exist.
   */
  findNextScheduled(userId: string, deckId?: string): Promise<Date | null>;
}
