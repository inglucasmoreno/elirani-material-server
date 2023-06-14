import { Module } from '@nestjs/common';
import { ObrasMaderaPasesService } from './obras-madera-pases.service';
import { ObrasMaderaPasesController } from './obras-madera-pases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasMaderaPases } from './entities';
import { ObrasMadera } from '../obras-madera/entities';
import { ObrasMaderaMotivosPases } from '../obras-madera-motivos-pases/entities';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ ObrasMaderaMotivosPases ]),
    TypeOrmModule.forFeature([ ObrasMaderaPases ]),
    TypeOrmModule.forFeature([ ObrasMadera ]), 
  ],
  providers: [ObrasMaderaPasesService],
  controllers: [ObrasMaderaPasesController]
})
export class ObrasMaderaPasesModule {}
