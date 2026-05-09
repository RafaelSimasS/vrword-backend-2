// src/presenters/http/study/study.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../guards/jwt-cookie.guard';
import { ReviewCardDto } from '../../../application/study/dto/review-card.dto';
import { ReviewCardUseCase } from '../../../application/study/use-cases/review-card.usecase';
import { GetNextUseCase } from '../../../application/study/use-cases/get-next.usecase';
import { GetProgressUseCase } from '../../../application/study/use-cases/get-progress.usecase';
import { GetNextScheduledUseCase } from '../../../application/study/use-cases/get-next-scheduled.usecase';

@Controller('study')
@UseGuards(JwtCookieAuthGuard)
export class StudyController {
  constructor(
    private readonly reviewCard: ReviewCardUseCase,
    private readonly getNext: GetNextUseCase,
    private readonly getProgress: GetProgressUseCase,
    private readonly getNextScheduled: GetNextScheduledUseCase,
  ) {}

  @Post('review')
  async review(@Req() req: any, @Body() body: ReviewCardDto) {
    const userId = req.user?.id;
    return this.reviewCard.execute({
      userId,
      cardId: body.cardId,
      quality: body.quality,
    });
  }

  @Get('next')
  async next(
    @Req() req: any,
    @Query('deckId') deckId?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user?.id;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.getNext.execute({ userId, deckId, limit: limitNum });
  }

  @Get('next-scheduled')
  async nextScheduled(@Req() req: any, @Query('deckId') deckId?: string) {
    const userId = req.user?.id;
    return this.getNextScheduled.execute({ userId, deckId });
  }

  @Get(':cardId')
  async progress(@Req() req: any, @Param('cardId') cardId: string) {
    const userId = req.user?.id;
    return this.getProgress.execute({ userId, cardId });
  }
}
