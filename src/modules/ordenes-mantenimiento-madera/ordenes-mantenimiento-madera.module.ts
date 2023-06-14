import { Module } from '@nestjs/common';
import { OrdenesMantenimientoMaderaController } from './ordenes-mantenimiento-madera.controller';
import { OrdenesMantenimientoMaderaService } from './ordenes-mantenimiento-madera.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesMantenimientoMadera } from './entities';

@Module({
  imports: [ TypeOrmModule.forFeature([ OrdenesMantenimientoMadera ]) ],
  controllers: [OrdenesMantenimientoMaderaController],
  providers: [OrdenesMantenimientoMaderaService]
})
export class OrdenesMantenimientoMaderaModule {}
