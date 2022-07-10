import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IPokemonResponse } from 'src/common/interfaces/pokemon.interface';
import { PokeApiService } from 'src/services/pokeapi.service';
import { PokemonDTO } from '../dto/pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(private readonly pokeApiService: PokeApiService) {}

  async getAllPokemon(data: PokemonDTO): Promise<Observable<IPokemonResponse>> {
    return this.pokeApiService.findAll(data);
  }
}
