import { Inject } from '@nestjs/common';
import { Deck } from 'generated/prisma/client';
import {
  DECK_REPOSITORY,
  IDeckRepository,
} from 'src/domain/deck/repositories/deck.repository';

export class CreateDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepo: IDeckRepository,
  ) {}

  async execute(input: {
    title: string;
    description?: string;
    userId: string;
  }): Promise<Deck> {
    const deck = await this.deckRepo.create({
      title: input.title,
      description: input.description,
      userId: input.userId,
    });
    return deck;
  }
}
