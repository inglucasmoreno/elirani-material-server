import { BaseEntity } from "../../../database/base.entity";
import { IMueblesPlacas } from "../../../interfaces";
import { Muebles } from "../../../modules/muebles/entities";
import { TiposPlacasMadera } from "../../../modules/tipos-placas-madera/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class MueblesPlacas extends BaseEntity implements IMueblesPlacas {

  @Column({ nullable: false })
  cantidad: number;
  
  // Relacion (Many) -> Mueble (One)
  @ManyToOne(() => Muebles, mueble => mueble.muebles_placas, { onDelete: "CASCADE" })
  mueble: Muebles;

  // Relacion (Many) -> Tipo de placas (One)
  @ManyToOne(() => TiposPlacasMadera, tipo_placa_madera => tipo_placa_madera.muebles_placas)
  tipo_placa_madera: TiposPlacasMadera;

  // Relacion (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.muebles_placas)
  creatorUser: Usuarios;

  // Relacion (Many) -> Usuario actualizador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.muebles_placas)
  updatorUser: Usuarios;

}