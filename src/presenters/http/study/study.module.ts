// src/presenters/http/study/study.module.ts
import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { PrismaStudyAdapter } from '../../../infrastructure/adapters/prisma-study.adapter';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { ReviewCardUseCase } from '../../../application/study/use-cases/review-card.usecase';
import { GetNextUseCase } from '../../../application/study/use-cases/get-next.usecase';
import { GetProgressUseCase } from '../../../application/study/use-cases/get-progress.usecase';
import { AuthModule } from '../auth/auth.module';
import { STUDY_REPOSITORY } from 'src/domain/study/repositories/study.repository';

@Module({
  imports: [AuthModule],
  controllers: [StudyController],
  providers: [
    PrismaService,
    { provide: STUDY_REPOSITORY, useClass: PrismaStudyAdapter },
    {
      provide: ReviewCardUseCase,
      useFactory: (repo: any, prisma: PrismaService) =>
        new ReviewCardUseCase(repo, prisma),
      inject: [STUDY_REPOSITORY, PrismaService],
    },
    {
      provide: GetNextUseCase,
      useFactory: (repo: any) => new GetNextUseCase(repo),
      inject: [STUDY_REPOSITORY],
    },
    {
      provide: GetProgressUseCase,
      useFactory: (repo: any) => new GetProgressUseCase(repo),
      inject: [STUDY_REPOSITORY],
    },
  ],
  exports: [],
})
export class StudyModule {}
