import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokeApiService } from 'src/services/pokeapi.service';
import { PokemonController } from './controller/pokemon.controller';
import { PokemonService } from './service/pokemon.service';

@Module({
  imports: [HttpModule],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService],
})
export class PokemonModule {}
