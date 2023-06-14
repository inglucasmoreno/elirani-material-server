import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../usuarios/entities';
import { InicializacionController } from './inicializacion.controller';
import { InicializacionService } from './inicializacion.service';
import { ObrasMaderaMotivosPases } from '../obras-madera-motivos-pases/entities';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ Usuarios ]),
    TypeOrmModule.forFeature([ ObrasMaderaMotivosPases ]), 
  ],
  controllers: [InicializacionController],
  providers: [InicializacionService]
})
export class InicializacionModule {}
