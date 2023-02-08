import { IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryHistoryDto {
  @IsPositive()
  @IsOptional()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly methodName: string;

  @IsPositive()
  @IsOptional()
  readonly userId: number;
}
