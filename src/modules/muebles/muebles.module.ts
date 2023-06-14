import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Muebles } from './entities';
import { MueblesController } from './muebles.controller';
import { MueblesService } from './muebles.service';
import { ObrasMadera } from '../obras-madera/entities';
import { MueblesPlacas } from '../muebles-placas/entities';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ Muebles ]),
    TypeOrmModule.forFeature([ ObrasMadera ]), 
    TypeOrmModule.forFeature([ MueblesPlacas ]), 
  ],
  controllers: [MueblesController],
  providers: [MueblesService]
})
export class MueblesModule {



}
