import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from './entities';
import { UsuariosPermisos } from '../usuarios-permisos/entities';

@Module({
  imports: [ TypeOrmModule.forFeature([ Usuarios, UsuariosPermisos ]) ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService]
})
export class UsuariosModule {}
