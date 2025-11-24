// src/presenters/http/card/card.module.ts
import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { PrismaCardAdapter } from '../../../infrastructure/adapters/prisma-card.adapter';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateCardUseCase } from '../../../application/card/use-cases/create-card.usecase';
import { UpdateCardUseCase } from '../../../application/card/use-cases/update-card.usecase';
import { DeleteCardUseCase } from '../../../application/card/use-cases/delete-card.usecase';
import { ShowCardUseCase } from '../../../application/card/use-cases/show-card.usecase';
import { ListCardsUseCase } from '../../../application/card/use-cases/list-cards.usecase';
import { JwtCookieAuthGuard } from '../guards/jwt-cookie.guard';
import { CARD_REPOSITORY } from 'src/domain/card/repositories/card.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CardController],
  providers: [
    PrismaService,
    { provide: CARD_REPOSITORY, useClass: PrismaCardAdapter },
    {
      provide: CreateCardUseCase,
      useFactory: (repo: any) => new CreateCardUseCase(repo),
      inject: [CARD_REPOSITORY],
    },
    {
      provide: UpdateCardUseCase,
      useFactory: (repo: any) => new UpdateCardUseCase(repo),
      inject: [CARD_REPOSITORY],
    },
    {
      provide: DeleteCardUseCase,
      useFactory: (repo: any) => new DeleteCardUseCase(repo),
      inject: [CARD_REPOSITORY],
    },
    {
      provide: ShowCardUseCase,
      useFactory: (repo: any) => new ShowCardUseCase(repo),
      inject: [CARD_REPOSITORY],
    },
    {
      provide: ListCardsUseCase,
      useFactory: (repo: any) => new ListCardsUseCase(repo),
      inject: [CARD_REPOSITORY],
    },
  ],
  exports: [],
})
export class CardModule {}
