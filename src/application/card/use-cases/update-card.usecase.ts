// src/application/card/use-cases/update-card.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CARD_REPOSITORY,
  ICardRepository,
} from '../../../../src/domain/card/repositories/card.repository';
import { Card } from 'generated/prisma/client';

@Injectable()
export class UpdateCardUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepo: ICardRepository,
  ) {}

  async execute(input: {
    id: string;
    front?: string;
    back?: string;
    userId: string;
  }): Promise<Card | null> {
    return this.cardRepo.update(
      input.id,
      { front: input.front, back: input.back },
      input.userId,
    );
  }
}
