import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './presenters/http/auth/auth.module';
import { DeckModule } from './presenters/http/deck/deck.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { CardModule } from './presenters/http/card/card.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DeckModule,
    CardModule,
  ],
})
export class AppModule {}
