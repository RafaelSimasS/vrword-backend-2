// src/application/card/dto/update-card.dto.ts
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  front?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  back?: string;
}
