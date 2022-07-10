export interface IPokemon {
  name: string;
  url: string;
}

export interface IPokeApiResponse {
  count: number;
  next: string;
  previous: string;
  results: IPokemon[];
}

export interface IFilterOptions {
  itemsPerPage: number;
  currentPageItems: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface IPokemonResponse {
  result: IPokemon[];
  filterOptions: IFilterOptions;
}
