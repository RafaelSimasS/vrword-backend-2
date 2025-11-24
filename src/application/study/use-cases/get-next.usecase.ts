// src/application/study/use-cases/get-next.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  IStudyRepository,
  STUDY_REPOSITORY,
} from '../../../../src/domain/study/repositories/study.repository';

@Injectable()
export class GetNextUseCase {
  constructor(
    @Inject(STUDY_REPOSITORY)
    private readonly studyRepo: IStudyRepository,
  ) {}

  async execute(input: { userId: string; deckId?: string; limit?: number }) {
    return this.studyRepo.findDueByDeck(
      input.userId,
      input.deckId,
      input.limit ?? 20,
    );
  }
}
