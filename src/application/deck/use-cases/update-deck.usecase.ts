import { Inject } from '@nestjs/common';
import { Deck } from 'generated/prisma/client';
import {
  DECK_REPOSITORY,
  IDeckRepository,
} from 'src/domain/deck/repositories/deck.repository';

export class UpdateDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepo: IDeckRepository,
  ) {}

  async execute(input: {
    id: string;
    title?: string;
    description?: string;
    userId: string;
  }): Promise<Deck | null> {
    return this.deckRepo.update(
      input.id,
      { title: input.title, description: input.description ?? null },
      input.userId,
    );
  }
}
