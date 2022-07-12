import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class PokemonFindOptionsDTO {
  @ApiProperty({
    description: 'Nombre del pokemon para realizar una búsqueda parcial',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly searchTerm?: string;

  @ApiProperty({
    description: 'Numbero de pokemon por página',
    required: false,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (value.trim() ? Number(value) : undefined))
  readonly limit?: number;

  @ApiProperty({
    description: 'Número de página',
    required: false,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (value.trim() ? Number(value) : undefined))
  readonly page?: number;
}
