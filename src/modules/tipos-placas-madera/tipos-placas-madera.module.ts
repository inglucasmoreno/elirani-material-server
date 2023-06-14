import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposPlacasMadera } from './entities';
import { TiposPlacasMaderaController } from './tipos-placas-madera.controller';
import { TiposPlacasMaderaService } from './tipos-placas-madera.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ TiposPlacasMadera ]) ],
  controllers: [TiposPlacasMaderaController],
  providers: [TiposPlacasMaderaService]
})
export class TiposPlacasMaderaModule {}
