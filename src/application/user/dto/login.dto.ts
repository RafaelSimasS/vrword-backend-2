import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Senha precisa ter ao menos 8 caracteres' })
  @MaxLength(128, { message: 'Senha muito longa' })
  password!: string;
}
