import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class GenerateCardsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @Matches(/^[A-Za-z\u00C0-\u024F\s'\-]+$/, {
    message: 'word must contain only letters',
  })
  word!: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9_\-]*$/, {
    message:
      'deckId must contain only alphanumeric characters, hyphens or underscores',
  })
  deckId?: string;
}
