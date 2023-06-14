import { Module } from '@nestjs/common';
import { MueblesPlacasController } from './muebles-placas.controller';
import { MueblesPlacasService } from './muebles-placas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MueblesPlacas } from './entities';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ MueblesPlacas ]),
  ],
  controllers: [MueblesPlacasController],
  providers: [MueblesPlacasService]
})
export class MueblesPlacasModule {}
