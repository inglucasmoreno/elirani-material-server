import { Module } from '@nestjs/common';
import { ObrasMaderaMotivosPasesController } from './obras-madera-motivos-pases.controller';
import { ObrasMaderaMotivosPasesService } from './obras-madera-motivos-pases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasMaderaMotivosPases } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ObrasMaderaMotivosPases ]), 
  ],
  controllers: [ObrasMaderaMotivosPasesController],
  providers: [ObrasMaderaMotivosPasesService]
})
export class ObrasMaderaMotivosPasesModule {}
