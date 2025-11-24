// src/domain/card/repositories/card.repository.ts
import { Card } from 'generated/prisma/client';

export const CARD_REPOSITORY = 'CARD_REPOSITORY';

export interface ICardRepository {
  create(data: {
    front: string;
    back: string;
    deckId: string;
    userId: string;
  }): Promise<Card>;
  update(
    id: string,
    data: Partial<{ front: string; back: string }>,
    userId: string,
  ): Promise<Card | null>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string, userId?: string): Promise<Card | null>;
  findAllByDeck(
    deckId: string,
    userId?: string,
    take?: number,
    skip?: number,
  ): Promise<Card[]>;
}
