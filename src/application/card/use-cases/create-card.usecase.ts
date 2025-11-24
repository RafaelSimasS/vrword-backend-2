// src/application/card/use-cases/create-card.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CARD_REPOSITORY,
  ICardRepository,
} from '../../../../src/domain/card/repositories/card.repository';
import { Card } from 'generated/prisma/client';

@Injectable()
export class CreateCardUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepo: ICardRepository,
  ) {}

  async execute(input: {
    front: string;
    back: string;
    deckId: string;
    userId: string;
  }): Promise<Card> {
    return this.cardRepo.create(input);
  }
}
