import { BaseEntity } from "../../../database/base.entity";
import { IMuebles } from "../../../interfaces";
import { MueblesPlacas } from "../../../modules/muebles-placas/entities";
import { ObrasMadera } from "../../../modules/obras-madera/entities";
import { TiposMuebles } from "../../../modules/tipos-muebles/entities";
import { TiposPlacasMadera } from "../../../modules/tipos-placas-madera/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Muebles extends BaseEntity implements IMuebles {

  @Column({ default: '' })
  observaciones: string;

  @Column({ nullable: false })
  precio: number;

  @Column({ default: 'Pendiente' })
  estado: string;

  // Muebles (One) -> Placas (Many)
  @OneToMany(() => MueblesPlacas, muebles_placas => muebles_placas.mueble)
  muebles_placas: MueblesPlacas[];

  // Muebles (Many) -> Obra (One)
  @ManyToOne(() => ObrasMadera, obra => obra.muebles, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'obra_id' })
  obra_madera: ObrasMadera;

  // Muebles (Many) -> Tipo de mueble (One)
  @ManyToOne(() => TiposMuebles, tipo_mueble => tipo_mueble.muebles)
  @JoinColumn({ name: 'tipo_mueble_id' })
  tipo_mueble: TiposMuebles;

  // Muebles (Many) -> Tipos de placas (Many)
  @ManyToMany(() => TiposPlacasMadera)
  @JoinTable({name: 'muebles_tipos_placas'})
  tipos_placas_madera: TiposPlacasMadera[];

  // Muebles (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  creatorUser: Usuarios;

  // Muebles (Many) -> Usuario actualizador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  updatorUser: Usuarios;

}