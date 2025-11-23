import { Inject } from '@nestjs/common';
import { Deck } from 'generated/prisma/client';
import {
  DECK_REPOSITORY,
  IDeckRepository,
} from 'src/domain/deck/repositories/deck.repository';

export class ListDecksUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepo: IDeckRepository,
  ) {}

  async execute(input: {
    userId: string;
    take?: number;
    skip?: number;
  }): Promise<Deck[]> {
    return this.deckRepo.findAllByUser(input.userId, input.take, input.skip);
  }
}
