import {
  Inject,
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ILlmUsageRepository,
  LLM_USAGE_REPOSITORY,
} from '../../../domain/llm/repositories/llm-usage.repository';
import { LlmServerClient } from '../../../infrastructure/http/llm-server.client';

const DAILY_LIMIT = 50;

@Injectable()
export class GenerateCardsUseCase {
  private readonly logger = new Logger(GenerateCardsUseCase.name);

  constructor(
    @Inject(LLM_USAGE_REPOSITORY)
    private readonly usageRepo: ILlmUsageRepository,
    private readonly llmClient: LlmServerClient,
  ) {}

  async execute(input: { userId: string; word: string; deckId?: string }) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const count = await this.usageRepo.getDailyCount(input.userId, today);
    if (count >= DAILY_LIMIT) {
      throw new HttpException(
        'Daily sentence generation limit reached. Try again tomorrow.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    let cards: Awaited<ReturnType<LlmServerClient['generateCards']>>;
    try {
      cards = await this.llmClient.generateCards(
        input.word,
        input.deckId,
        input.userId,
      );
    } catch (err: any) {
      this.logger.warn('LLM generation failed: %s', err?.message);
      throw new UnprocessableEntityException(
        err?.message ?? 'Could not generate sentences. Please try again.',
      );
    }

    await this.usageRepo.increment(input.userId, today);

    return cards;
  }
}
