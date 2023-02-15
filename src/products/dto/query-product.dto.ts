import { IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryProductDto {
  @IsPositive()
  @IsOptional()
  readonly id: number;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsPositive()
  @IsOptional()
  readonly mainCategoryId: number;

  @IsPositive()
  @IsOptional()
  readonly categoryId: number;
}
