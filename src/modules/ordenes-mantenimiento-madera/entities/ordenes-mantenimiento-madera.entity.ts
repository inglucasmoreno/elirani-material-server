import { BaseEntity } from "../../../database/base.entity";
import { IOrdenesMantenimientoMadera } from "../../../interfaces";
import { ObrasMadera } from "../../../modules/obras-madera/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, ManyToOne } from "typeorm";
@Entity()
export class OrdenesMantenimientoMadera extends BaseEntity implements IOrdenesMantenimientoMadera {

  @Column({
    default: new Date()
  })
  fecha: Date;

  @Column({
    default: '',
    type: 'varchar',
    length: 250
   })
  observaciones: string;

  // Orden de mantenimiento (Many) -> Obra madera (One)
  @ManyToOne(() => ObrasMadera, obra_madera => obra_madera.ordenes_mantenimiento)
  obra_madera: ObrasMadera[];

  @Column({ 
    nullable: true,
  })
  precio: number;

  // Tipos muebles (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  creatorUser: Usuarios;

  // Tipos muebles (Many) -> Usuario actualizardor (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  updatorUser: Usuarios;

}