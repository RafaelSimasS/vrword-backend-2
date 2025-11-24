// src/application/card/use-cases/show-card.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CARD_REPOSITORY,
  ICardRepository,
} from '../../../../src/domain/card/repositories/card.repository';
import { Card } from 'generated/prisma/client';

@Injectable()
export class ShowCardUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepo: ICardRepository,
  ) {}

  async execute(input: { id: string; userId?: string }): Promise<Card | null> {
    return this.cardRepo.findById(input.id, input.userId);
  }
}
