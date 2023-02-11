import { IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryProductCategoryDto {
  @IsPositive()
  @IsOptional()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsPositive()
  @IsOptional()
  readonly mpcId: number;
}
