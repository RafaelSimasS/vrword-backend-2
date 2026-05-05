import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../guards/jwt-cookie.guard';
import { GenerateCardsDto } from '../../../application/llm/dto/generate-cards.dto';
import { GenerateCardsUseCase } from '../../../application/llm/use-cases/generate-cards.usecase';
import { LlmServerClient } from '../../../infrastructure/http/llm-server.client';
import { IsString } from 'class-validator';

class DetectDto {
  @IsString()
  image!: string;
}

@Controller()
@UseGuards(JwtCookieAuthGuard)
export class LlmController {
  constructor(
    private readonly generateCards: GenerateCardsUseCase,
    private readonly llmClient: LlmServerClient,
  ) {}

  @Post('generate')
  async generate(@Req() req: any, @Body() body: GenerateCardsDto) {
    const userId: string = req.user?.id;
    const cards = await this.generateCards.execute({
      userId,
      word: body.word,
      deckId: body.deckId,
    });

    // Transforma [{front, back}] → {word, sentences: [{en, pt}]}
    // para corresponder ao contrato esperado pelo frontend.
    return {
      word: body.word,
      sentences: cards.map((c) => ({ en: c.front, pt: c.back })),
    };
  }

  @Post('detect')
  async detect(@Req() req: any, @Body() body: DetectDto) {
    const userId: string = req.user?.id;

    if (!body.image) {
      throw new HttpException(
        'image is required',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      return await this.llmClient.detectObjects(body.image, userId);
    } catch (err: any) {
      throw new HttpException(
        err?.message ?? 'Object detection failed. Please try again.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
