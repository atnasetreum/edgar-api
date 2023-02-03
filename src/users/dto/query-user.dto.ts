import { IsOptional, IsPositive } from 'class-validator';

export class QueryUserDto {
  @IsPositive()
  @IsOptional()
  readonly id: number;

  @IsPositive()
  @IsOptional()
  readonly typeId: number;
}
