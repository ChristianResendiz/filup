import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PokemonNameDTO {
  @ApiProperty({
    description: 'Nombre del pokemon',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly name: string;
}
