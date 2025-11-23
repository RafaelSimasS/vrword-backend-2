import { Deck } from 'generated/prisma/client';

export const DECK_REPOSITORY = 'IDeckRepository';

export interface IDeckRepository {
  create(data: {
    title: string;
    description?: string;
    userId: string;
  }): Promise<Deck>;

  update(
    id: string,
    data: Partial<{
      title?: string;
      description?: string | null;
    }>,
    userId: string,
  ): Promise<Deck | null>;

  delete(id: string, userId: string): Promise<void>;

  findById(id: string, userId?: string): Promise<Deck | null>;

  findAllByUser(userId: string, take?: number, skip?: number): Promise<Deck[]>;
}
