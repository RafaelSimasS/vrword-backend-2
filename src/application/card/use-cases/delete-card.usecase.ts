// src/application/card/use-cases/delete-card.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CARD_REPOSITORY,
  ICardRepository,
} from '../../../../src/domain/card/repositories/card.repository';

@Injectable()
export class DeleteCardUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepo: ICardRepository,
  ) {}

  async execute(input: { id: string; userId: string }): Promise<void> {
    await this.cardRepo.delete(input.id, input.userId);
  }
}
