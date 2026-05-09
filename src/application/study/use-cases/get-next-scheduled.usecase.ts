// src/application/study/use-cases/get-next-scheduled.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  IStudyRepository,
  STUDY_REPOSITORY,
} from '../../../domain/study/repositories/study.repository';

@Injectable()
export class GetNextScheduledUseCase {
  constructor(
    @Inject(STUDY_REPOSITORY)
    private readonly studyRepo: IStudyRepository,
  ) {}

  /**
   * Returns the earliest future dueDate for a user (optionally by deckId).
   * Null when no future review is scheduled.
   */
  async execute(input: {
    userId: string;
    deckId?: string;
  }): Promise<{ nextDate: Date | null }> {
    const nextDate = await this.studyRepo.findNextScheduled(
      input.userId,
      input.deckId,
    );
    return { nextDate };
  }
}
