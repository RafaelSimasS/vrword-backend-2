import { Inject } from '@nestjs/common';
import { Deck } from 'generated/prisma/client';
import {
  DECK_REPOSITORY,
  IDeckRepository,
} from 'src/domain/deck/repositories/deck.repository';

export class ShowDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepo: IDeckRepository,
  ) {}

  async execute(input: { id: string; userId?: string }): Promise<Deck | null> {
    return this.deckRepo.findById(input.id, input.userId);
  }
}
