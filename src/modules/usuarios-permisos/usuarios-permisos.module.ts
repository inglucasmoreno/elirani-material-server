import { Module } from '@nestjs/common';
import { UsuariosPermisosController } from './usuarios-permisos.controller';
import { UsuariosPermisosService } from './usuarios-permisos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosPermisos } from './entities';

@Module({
  imports: [ TypeOrmModule.forFeature([ UsuariosPermisos ]) ],
  controllers: [UsuariosPermisosController],
  providers: [UsuariosPermisosService]
})
export class UsuariosPermisosModule {}
