import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PokemonModule } from './modules/pokemon/pokemon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
