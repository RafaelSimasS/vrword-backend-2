// src/presenters/http/card/card.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../guards/jwt-cookie.guard';
import { CreateCardDto } from '../../../application/card/dto/create-card.dto';
import { UpdateCardDto } from '../../../application/card/dto/update-card.dto';
import { CreateCardUseCase } from '../../../application/card/use-cases/create-card.usecase';
import { UpdateCardUseCase } from '../../../application/card/use-cases/update-card.usecase';
import { DeleteCardUseCase } from '../../../application/card/use-cases/delete-card.usecase';
import { ShowCardUseCase } from '../../../application/card/use-cases/show-card.usecase';
import { ListCardsUseCase } from '../../../application/card/use-cases/list-cards.usecase';

@Controller('cards')
@UseGuards(JwtCookieAuthGuard)
export class CardController {
  constructor(
    private readonly createCard: CreateCardUseCase,
    private readonly updateCard: UpdateCardUseCase,
    private readonly deleteCard: DeleteCardUseCase,
    private readonly showCard: ShowCardUseCase,
    private readonly listCards: ListCardsUseCase,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() body: CreateCardDto) {
    const userId = req.user?.id;
    return this.createCard.execute({
      front: body.front,
      back: body.back,
      deckId: body.deckId,
      userId,
    });
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateCardDto,
  ) {
    const userId = req.user?.id;
    const updated = await this.updateCard.execute({
      id,
      front: body.front,
      back: body.back,
      userId,
    });
    if (!updated) {
      return { error: 'Not found or unauthorized' };
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    await this.deleteCard.execute({ id, userId });
    return { ok: true };
  }

  @Get(':id')
  async show(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    const card = await this.showCard.execute({ id, userId });
    if (!card) return { error: 'Not found or unauthorized' };
    return card;
  }

  @Get()
  async list(
    @Req() req: any,
    @Query('deckId') deckId: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    const userId = req.user?.id;
    const takeNum = take ? parseInt(take, 10) : undefined;
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    return this.listCards.execute({
      deckId,
      userId,
      take: takeNum,
      skip: skipNum,
    });
  }
}
