import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsPositive()
  @IsNotEmpty()
  readonly mpcId: number;
}
