import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Clientes } from './entities';

@Module({
  imports: [ TypeOrmModule.forFeature([ Clientes ]) ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
