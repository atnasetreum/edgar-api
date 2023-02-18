import { IsString, IsOptional } from 'class-validator';

export class QueryComandaDto {
  @IsString()
  @IsOptional()
  readonly state: string;
}
