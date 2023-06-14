import { BaseEntity } from "../../../database/base.entity";
import { ITiposMuebles } from "../../../interfaces";
import { Muebles } from "../../../modules/muebles/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class TiposMuebles extends BaseEntity implements ITiposMuebles {

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 150
   })
  descripcion: string;

  @Column({
    default: true,
    type: 'boolean',
   })
  placas: boolean;

  // Tipo mueble (One) -> Muebles (Many)
  @OneToMany(() => Muebles, muebles => muebles.tipo_mueble)
  muebles: Muebles[];

  // Tipos muebles (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  creatorUser: Usuarios;

  // Tipos muebles (Many) -> Usuario actualizardor (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  updatorUser: Usuarios;

}