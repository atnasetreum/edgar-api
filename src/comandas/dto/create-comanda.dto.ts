import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

class BebidaOrComida {
  @IsNotEmpty()
  @IsPositive()
  readonly productId: number;

  @IsNotEmpty()
  @IsPositive()
  readonly count: number;

  @IsOptional()
  @IsString()
  readonly note: string;
}

export class CreateComandaDto {
  @IsPositive()
  @IsNotEmpty()
  readonly mesa: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BebidaOrComida)
  readonly bebida: BebidaOrComida[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BebidaOrComida)
  readonly comida: BebidaOrComida[];
}
