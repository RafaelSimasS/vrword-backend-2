import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmController } from './llm.controller';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { PrismaLlmUsageAdapter } from '../../../infrastructure/adapters/prisma-llm-usage.adapter';
import { LlmServerClient } from '../../../infrastructure/http/llm-server.client';
import { GenerateCardsUseCase } from '../../../application/llm/use-cases/generate-cards.usecase';
import { AuthModule } from '../auth/auth.module';
import { LLM_USAGE_REPOSITORY } from '../../../domain/llm/repositories/llm-usage.repository';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [LlmController],
  providers: [
    PrismaLlmUsageAdapter,
    LlmServerClient,
    { provide: LLM_USAGE_REPOSITORY, useExisting: PrismaLlmUsageAdapter },
    {
      provide: GenerateCardsUseCase,
      useFactory: (repo: PrismaLlmUsageAdapter, client: LlmServerClient) =>
        new GenerateCardsUseCase(repo, client),
      inject: [LLM_USAGE_REPOSITORY, LlmServerClient],
    },
  ],
})
export class LlmModule {}
