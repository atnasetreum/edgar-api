import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
