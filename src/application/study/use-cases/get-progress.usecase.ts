// src/application/study/use-cases/get-progress.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  IStudyRepository,
  STUDY_REPOSITORY,
} from '../../../../src/domain/study/repositories/study.repository';

@Injectable()
export class GetProgressUseCase {
  constructor(
    @Inject(STUDY_REPOSITORY)
    private readonly studyRepo: IStudyRepository,
  ) {}

  async execute(input: { userId: string; cardId: string }) {
    return this.studyRepo.findByCardAndUser(input.cardId, input.userId);
  }
}
