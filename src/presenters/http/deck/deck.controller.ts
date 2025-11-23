import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../guards/jwt-cookie.guard';
import { CreateDeckUseCase } from 'src/application/deck/use-cases/create-deck.usecase';
import { UpdateDeckUseCase } from 'src/application/deck/use-cases/update-deck.usecase';
import { DeleteDeckUseCase } from 'src/application/deck/use-cases/delete-deck.usecase';
import { ShowDeckUseCase } from 'src/application/deck/use-cases/show-deck.usecase';
import { ListDecksUseCase } from 'src/application/deck/use-cases/list-decks.usecase';
import { UpdateDeckDto } from 'src/application/deck/dto/update-deck.dto';
import { CreateDeckDto } from 'src/application/deck/dto/create-deck.dto';

@Controller('decks')
@UseGuards(JwtCookieAuthGuard)
export class DeckController {
  constructor(
    private readonly createDeck: CreateDeckUseCase,
    private readonly updateDeck: UpdateDeckUseCase,
    private readonly deleteDeck: DeleteDeckUseCase,
    private readonly showDeck: ShowDeckUseCase,
    private readonly listDecks: ListDecksUseCase,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() body: CreateDeckDto) {
    const userId = req.user?.id;
    return this.createDeck.execute({
      title: body.title,
      description: body.description,
      userId,
    });
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateDeckDto,
  ) {
    const userId = req.user?.id;
    const updated = await this.updateDeck.execute({
      id,
      title: body.title,
      description: body.description,
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
    await this.deleteDeck.execute({ id, userId });
    return { ok: true };
  }

  @Get(':id')
  async show(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    const deck = await this.showDeck.execute({ id, userId });
    if (!deck) return { error: 'Not found or unauthorized' };
    return deck;
  }

  @Get()
  async list(
    @Req() req: any,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    const userId = req.user?.id;
    const takeNum = take ? parseInt(take, 10) : undefined;
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    return this.listDecks.execute({ userId, take: takeNum, skip: skipNum });
  }
}
