import { ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const getAllPokemon: Partial<OperationObject> = {
  summary: 'Obtener todos los pokemon',
  description:
    'Obtener la lista de todos los pokemon con la opcion de filtrar por nombre y poder paginar la respuesta',
};

export const createPokemonPDF: Partial<OperationObject> = {
  summary: 'Obtener un PDF con la información de un pokemon',
  description:
    'Obtener un PDF con la información de un pokemon y su imagen en base a su nombre',
};

export const getAllPokemonResponse: ApiResponseOptions = {
  description: 'Lista de pokemon',
  schema: {
    type: 'object',
    properties: {
      result: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
      filterOptions: {
        type: 'object',
        properties: {
          itemsPerPage: { type: 'integer' },
          currentPageItems: { type: 'integer' },
          totalItems: { type: 'integer' },
          currentPage: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
    },
  },
};

export const createPokemonPDFResponse: ApiResponseOptions = {
  description: 'PDF de un pokemon',
  content: {
    'application/pdf': {
      schema: { type: 'string', format: 'binary' },
    },
  },
  headers: {
    'Content-Disposition': {
      description: 'Used only with `application/pdf` responses',
      schema: {
        type: 'string',
        example: 'attachment; filename="pokemon${id}.pdf"',
      },
    },
  },
  schema: {
    type: 'file',
  },
};

export const badRequest: ApiResponseOptions = {
  description: 'Error: Bad Request',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        default: 400,
      },
      message: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      error: {
        type: 'string',
        default: 'Bad Request',
      },
    },
  },
};

export const notFound: ApiResponseOptions = {
  description: 'Error: Not found',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        default: 404,
      },
      message: {
        type: 'string',
      },
      error: {
        type: 'string',
        default: 'Not Found',
      },
    },
  },
};

export const internalServerError: ApiResponseOptions = {
  description: 'Error: Internal server',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        default: 500,
      },
      message: {
        type: 'string',
        default: 'Internal Server Error',
      },
    },
  },
};
