import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { from, Observable } from 'rxjs';
import {
  IPokeApiResponse,
  IPokemon,
  IPokemonResponse,
} from 'src/common/interfaces/pokemon.interface';
import { map, mergeAll, pluck, skip, take, toArray, tap } from 'rxjs/operators';
import { PokemonDTO } from '../modules/pokemon/dto/pokemon.dto';

@Injectable()
export class PokeApiService {
  private baseUrl: string = process.env.POKEAPI_BASE_URL;
  private pokeArrFilter(term: string, data: IPokemon[]): IPokemon[] {
    return data.filter(({ name }) => name.includes(term));
  }
  private pokeArrSorter$(data: IPokemon[]): Observable<IPokemon> {
    return from(data.sort((a, b) => a.name.localeCompare(b.name)));
  }

  constructor(private readonly httpService: HttpService) {}

  findAll(data: PokemonDTO) {
    const { searchTerm: term = '', limit = 2000, page = 0 } = data;
    const offset = (page - 1) * limit || 0;
    let totalItems = 0;

    return this.httpService
      .get<IPokeApiResponse>(this.baseUrl, { params: { limit: 2000 } })
      .pipe(
        pluck('data', 'results'),
        map<IPokemon[], IPokemon[]>((data) => this.pokeArrFilter(term, data)),
        tap((data) => (totalItems = data.length)),
        map<IPokemon[], Observable<IPokemon>>(this.pokeArrSorter$),
        mergeAll<Observable<IPokemon>>(),
        skip<IPokemon>(offset),
        take<IPokemon>(limit),
        toArray<IPokemon>(),
        map<IPokemon[], IPokemonResponse>((result) => ({
          result,
          filterOptions: {
            itemsPerPage: limit < totalItems ? limit : totalItems,
            currentPageItems: result.length,
            totalItems,
            currentPage: (offset + limit) / limit,
            totalPages: Math.ceil(totalItems / limit),
          },
        })),
      );
  }
}
