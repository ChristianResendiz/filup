import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { PokemonFindOptionsDTO } from '../dto/pokemon-find-options.dto';
import { PokemonService } from '../service/pokemon.service';
import { PokemonNameDTO } from '../dto/pokemon-name.dto';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import {
  badRequest,
  createPokemonPDF,
  createPokemonPDFResponse,
  getAllPokemon,
  getAllPokemonResponse,
  internalServerError,
  notFound,
} from '../pokemon.swagger';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation(getAllPokemon)
  @ApiOkResponse(getAllPokemonResponse)
  @ApiBadRequestResponse(badRequest)
  @ApiNotFoundResponse(notFound)
  @ApiInternalServerErrorResponse(internalServerError)
  getAllPokemon(@Query() data: PokemonFindOptionsDTO) {
    return this.pokemonService.getAllPokemon(data);
  }

  @Post()
  @ApiProduces('application/pdf')
  @ApiOperation(createPokemonPDF)
  @ApiCreatedResponse(createPokemonPDFResponse)
  @ApiBadRequestResponse(badRequest)
  @ApiNotFoundResponse(notFound)
  @ApiInternalServerErrorResponse(internalServerError)
  createPokemonPDF(
    @Body() data: PokemonNameDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.pokemonService.createPokemonPDF(data, res);
  }
}
