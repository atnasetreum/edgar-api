import { IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryUserTypeDto {
  @IsPositive()
  @IsOptional()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly name: string;
}
