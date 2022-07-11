import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { PokemonFindOptionsDTO } from '../dto/pokemon-find-options.dto';
import { PokemonService } from '../service/pokemon.service';
import { PokemonNameDTO } from '../dto/pokemon-name.dto';
import { Response } from 'express';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getAllPokemon(@Query() data: PokemonFindOptionsDTO) {
    return this.pokemonService.getAllPokemon(data);
  }

  @Post()
  createPokemonPDF(
    @Body() data: PokemonNameDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.pokemonService.createPokemonPDF(data, res);
  }
}
