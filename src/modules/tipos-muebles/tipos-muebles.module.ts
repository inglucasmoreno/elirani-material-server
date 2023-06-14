import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposMuebles } from './entities';
import { TiposMueblesController } from './tipos-muebles.controller';
import { TiposMueblesService } from './tipos-muebles.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ TiposMuebles ]) ],
  controllers: [TiposMueblesController],
  providers: [TiposMueblesService]
})
export class TiposMueblesModule {}
