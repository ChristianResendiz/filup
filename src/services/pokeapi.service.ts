import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EMPTY, Observable, of, empty } from 'rxjs';
import {
  IPokeApiResponse,
  IPokemon,
  IPokemonComplete,
} from 'src/common/interfaces/pokemon.interface';
import { catchError, pluck } from 'rxjs/operators';
import { PokemonNameDTO } from '../modules/pokemon/dto/pokemon-name.dto';
import { AxiosError } from 'axios';

@Injectable()
export class PokeApiService {
  private baseUrl: string = process.env.POKEAPI_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<IPokemon[]> {
    const url = `${this.baseUrl}/pokemon`;
    return this.httpService
      .get<IPokeApiResponse>(url, { params: { limit: 2000 } })
      .pipe(
        pluck('data', 'results'),
        catchError((error: AxiosError) => {
          Logger.error(`PokeApiService: ${error.message}`);
          return of([]);
        }),
      );
  }

  findByName(data: PokemonNameDTO): Observable<IPokemonComplete> {
    const { name } = data;
    const url = `${this.baseUrl}/pokemon/${name}`;
    return this.httpService.get<IPokemonComplete>(url).pipe(
      pluck('data'),
      catchError((error: AxiosError) => {
        if (error.response?.status !== 404)
          Logger.error(`PokeApiService: ${error.message}`);
        return of(null);
      }),
    );
  }
}
