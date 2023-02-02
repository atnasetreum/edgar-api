import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsPositive()
  @IsNotEmpty()
  readonly idUserType: number;
}
