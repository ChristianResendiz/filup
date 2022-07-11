import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PokemonNameDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly name: string;
}
