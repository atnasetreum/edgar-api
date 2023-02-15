import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;

  @IsPositive()
  @IsNotEmpty()
  readonly mainCategoryId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly categoryId: number;
}
