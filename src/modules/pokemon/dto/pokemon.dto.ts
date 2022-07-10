import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PokemonDTO {
  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly searchTerm?: string;

  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (value.trim() ? Number(value) : undefined))
  readonly limit?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (value.trim() ? Number(value) : undefined))
  readonly page?: number;
}
