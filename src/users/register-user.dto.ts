import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  displayName: string;
}
