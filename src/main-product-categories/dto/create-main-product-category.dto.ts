import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMainProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
