import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { map, mergeAll, skip, take, toArray } from 'rxjs/operators';
import { firstValueFrom, from, Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'html-pdf-node-ts';
import handlebars from 'handlebars';
import { PokeApiService } from 'src/services/pokeapi.service';
import { PokemonNameDTO } from '../dto/pokemon-name.dto';
import { PokemonFindOptionsDTO } from '../dto/pokemon-find-options.dto';
import {
  IPokemon,
  IPokemonResponse,
} from 'src/common/interfaces/pokemon.interface';
import { Response } from 'express';

@Injectable()
export class PokemonService {
  private pokeArrFilter(term: string, data: IPokemon[]): IPokemon[] {
    return data.filter(({ name }) => name.includes(term));
  }
  private pokeArrSorter$(data: IPokemon[]): Observable<IPokemon> {
    return from(data.sort((a, b) => a.name.localeCompare(b.name)));
  }
  private URLToId(data: IPokemon): IPokemon {
    return { id: data.url.split('/')[6], name: data.name };
  }
  private toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  constructor(private readonly pokeApiService: PokeApiService) {}

  async getAllPokemon(data: PokemonFindOptionsDTO): Promise<IPokemonResponse> {
    const { searchTerm: term = '', limit = 2000, page = 0 } = data;
    const offset = (page - 1) * limit || 0;
    let totalItems = 0;
    const result: IPokemon[] = await firstValueFrom(
      this.pokeApiService.findAll().pipe(
        map<IPokemon[], Observable<IPokemon>>((data) => {
          const arr = this.pokeArrFilter(term, data);
          totalItems = arr.length;
          return this.pokeArrSorter$(arr);
        }),
        mergeAll<Observable<IPokemon>>(),
        map(this.URLToId),
        skip(offset),
        take(limit),
        toArray(),
      ),
    );

    if (!result.length) {
      throw new NotFoundException('No pokemon were found');
    }

    return {
      result,
      filterOptions: {
        itemsPerPage: limit < totalItems ? limit : totalItems,
        currentPageItems: result.length,
        totalItems,
        currentPage: (offset + limit) / limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async createPokemonPDF(
    data: PokemonNameDTO,
    res: Response,
  ): Promise<StreamableFile> {
    const pokemon = await firstValueFrom(this.pokeApiService.findByName(data));

    if (!pokemon) {
      throw new NotFoundException('No pokemon was found');
    }

    const templateSource = await fs.promises.readFile(
      path.join(process.cwd(), '/src/sources/pokemon-template.html'),
      'utf8',
    );
    const template = handlebars.compile(templateSource);
    const result = template({
      id: pokemon.id,
      image: pokemon.sprites.other.home.front_default,
      name: this.toTitleCase(pokemon.name),
      types: pokemon.types.map(({ type }) => ({
        name: this.toTitleCase(type.name),
      })),
      stats: pokemon.stats.map(({ stat, base_stat }) => ({
        name: this.toTitleCase(stat.name.replace('-', ' ')),
        value: base_stat,
      })),
      abilities: pokemon.abilities.map(({ ability }) => ({
        name: this.toTitleCase(ability.name),
      })),
    });
    const file = await pdf.generatePdf(
      { content: result },
      { printBackground: true, format: 'A4' },
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="pokemon${pokemon.id}.pdf"`,
    });

    return new StreamableFile(file);
  }
}
