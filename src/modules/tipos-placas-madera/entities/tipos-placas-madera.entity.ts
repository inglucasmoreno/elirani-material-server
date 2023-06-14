import { BaseEntity } from "../../../database/base.entity";
import { ITiposPlacasMadera } from "../../../interfaces";
import { MueblesPlacas } from "../../../modules/muebles-placas/entities";
import { Muebles } from "../../../modules/muebles/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class TiposPlacasMadera extends BaseEntity implements ITiposPlacasMadera {

  @Column({
    nullable: false,
    type: 'varchar',
    length: 100
   })
  codigo: string;

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 150
   })
  descripcion: string;

  // Muebles (One) -> Placas (Many)
  @OneToMany(() => MueblesPlacas, muebles_placas => muebles_placas.tipo_placa_madera)
  muebles_placas: MueblesPlacas[];

  // Tipos placas (Many) -> Muebles (Many)
  @ManyToMany(() => Muebles, muebles => muebles.tipos_placas_madera)
  muebles: Muebles[];

  // Tipos de placas (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_placas_madera)
  creatorUser: Usuarios;

  // Tipos de placas (Many) -> Usuario actualizador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_placas_madera)
  updatorUser: Usuarios;

}