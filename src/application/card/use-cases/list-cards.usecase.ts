// src/application/card/use-cases/list-cards.usecase.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CARD_REPOSITORY,
  ICardRepository,
} from '../../../../src/domain/card/repositories/card.repository';
import { Card } from 'generated/prisma/client';

@Injectable()
export class ListCardsUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepo: ICardRepository,
  ) {}

  async execute(input: {
    deckId: string;
    userId?: string;
    take?: number;
    skip?: number;
  }): Promise<Card[]> {
    if (!input.deckId) {
      throw new BadRequestException('deckId is required on query');
    }
    return this.cardRepo.findAllByDeck(
      input.deckId,
      input.userId,
      input.take,
      input.skip,
    );
  }
}
