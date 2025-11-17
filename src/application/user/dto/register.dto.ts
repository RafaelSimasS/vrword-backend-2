import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha precisa ter ao menos 8 caracteres' })
  @MaxLength(128, { message: 'Senha muito longa' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Senha precisa conter ao menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;
}
