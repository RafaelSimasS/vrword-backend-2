// src/application/card/dto/create-card.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  front!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  back!: string;

  @IsString()
  @IsNotEmpty()
  deckId!: string;
}
