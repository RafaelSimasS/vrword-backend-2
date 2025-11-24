// src/application/study/dto/review-card.dto.ts
import { IsString, IsInt, Min, Max } from 'class-validator';

export class ReviewCardDto {
  @IsString()
  cardId!: string;

  @IsInt()
  @Min(0)
  @Max(5)
  quality!: number; // 0..5
}
