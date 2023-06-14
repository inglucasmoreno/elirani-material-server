import { BaseEntity } from "../../../database/base.entity";
import { IObrasMaderaMotivosPases } from "../../../interfaces";
import { ObrasMaderaPases } from "../../../modules/obras-madera-pases/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ObrasMaderaMotivosPases extends BaseEntity implements IObrasMaderaMotivosPases {

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 150
   })
  descripcion: string;

  // Pase (Many) -> Usuario creador (One)
  @OneToMany(() => ObrasMaderaPases, pases => pases.motivo)
  pases: ObrasMaderaPases;

  // Motivo pase (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  creatorUser: Usuarios;

  // Motivo pase (Many) -> Usuario actualizardor (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  updatorUser: Usuarios;

}