// src/application/study/dto/get-next.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class GetNextDto {
  @IsOptional()
  @IsString()
  deckId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
