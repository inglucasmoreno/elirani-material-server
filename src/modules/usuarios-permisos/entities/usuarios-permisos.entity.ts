import { BaseEntity } from '../../../database/base.entity';
import { IUsuariosPermisos } from '../../../interfaces';
import { Usuarios } from '../../../modules/usuarios/entities';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class UsuariosPermisos extends BaseEntity implements IUsuariosPermisos {

  @Column({ nullable: false })
  alcance: string;

  @Column({ nullable: false })
  permiso: string;

  // Permisos (Many) -> Usuario (One)
  @ManyToOne(() => Usuarios, usuarios => usuarios.permisos)
  usuario: Usuarios;

  // Permisos (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.permisos)
  creatorUser: Usuarios;

  // Permisos (Many) -> Usuario actualizador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.permisos)
  updatorUser: Usuarios;

}