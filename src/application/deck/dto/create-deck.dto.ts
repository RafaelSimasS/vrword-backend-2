import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;
}
