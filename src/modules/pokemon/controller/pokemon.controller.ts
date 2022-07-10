import { Controller, Get, Post, Query } from '@nestjs/common';
import { PokemonDTO } from '../dto/pokemon.dto';
import { PokemonService } from '../service/pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getAllPokemon(@Query() data: PokemonDTO) {
    return this.pokemonService.getAllPokemon(data);
  }

  // @Post()
}
