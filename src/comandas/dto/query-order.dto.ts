import { IsString, IsOptional } from 'class-validator';

export class QueryOrderDto {
  @IsString()
  @IsOptional()
  readonly type: string;
}
