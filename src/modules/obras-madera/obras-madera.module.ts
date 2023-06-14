import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasMadera } from './entities';
import { ObrasMaderaController } from './obras-madera.controller';
import { ObrasMaderaService } from './obras-madera.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ObrasMadera]), ],
  controllers: [ObrasMaderaController],
  providers: [ObrasMaderaService]
})
export class ObrasMaderaModule {}
