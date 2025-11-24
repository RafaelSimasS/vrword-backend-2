// src/presenters/http/deck/deck.module.ts
import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { PrismaDeckAdapter } from '../../../infrastructure/adapters/prisma-deck.adapter';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateDeckUseCase } from '../../../application/deck/use-cases/create-deck.usecase';
import { UpdateDeckUseCase } from '../../../application/deck/use-cases/update-deck.usecase';
import { DeleteDeckUseCase } from '../../../application/deck/use-cases/delete-deck.usecase';
import { ShowDeckUseCase } from '../../../application/deck/use-cases/show-deck.usecase';
import { ListDecksUseCase } from '../../../application/deck/use-cases/list-decks.usecase';
import { DECK_REPOSITORY } from 'src/domain/deck/repositories/deck.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DeckController],
  providers: [
    PrismaService,
    { provide: DECK_REPOSITORY, useClass: PrismaDeckAdapter },
    {
      provide: CreateDeckUseCase,
      useFactory: (repo: any) => new CreateDeckUseCase(repo),
      inject: [DECK_REPOSITORY],
    },
    {
      provide: UpdateDeckUseCase,
      useFactory: (repo: any) => new UpdateDeckUseCase(repo),
      inject: [DECK_REPOSITORY],
    },
    {
      provide: DeleteDeckUseCase,
      useFactory: (repo: any) => new DeleteDeckUseCase(repo),
      inject: [DECK_REPOSITORY],
    },
    {
      provide: ShowDeckUseCase,
      useFactory: (repo: any) => new ShowDeckUseCase(repo),
      inject: [DECK_REPOSITORY],
    },
    {
      provide: ListDecksUseCase,
      useFactory: (repo: any) => new ListDecksUseCase(repo),
      inject: [DECK_REPOSITORY],
    },
  ],
  exports: [],
})
export class DeckModule {}
