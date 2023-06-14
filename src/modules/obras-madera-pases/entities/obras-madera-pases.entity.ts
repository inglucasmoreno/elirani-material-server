import { BaseEntity } from "../../../database/base.entity";
import { IObrasMaderaPases } from "../../../interfaces";
import { ObrasMaderaMotivosPases } from "../../../modules/obras-madera-motivos-pases/entities";
import { ObrasMadera } from "../../../modules/obras-madera/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ObrasMaderaPases extends BaseEntity implements IObrasMaderaPases {

  @Column({
    nullable: false,
    enum: ['Adelante', 'Atras'],
    length: 50
   })
  tipo: string; // Adelante o Atras

  @Column({
    type: 'varchar',
    length: 150
   })
  observacion: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 100
   })
  etapa_anterior: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 100
   })
  etapa_actual: string;
  
  // Pase (Many) -> Obra (One)
  @ManyToOne(() => ObrasMadera, obra => obra.pases, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'obra_id' })
  obra_madera: ObrasMadera;

  // Pase (Many) -> Motivo (One)
  @ManyToOne(() => ObrasMaderaMotivosPases, motivo => motivo.pases)
  @JoinColumn({ name: 'motivo_id' })
  motivo: ObrasMaderaMotivosPases;

  // Tipos muebles (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  creatorUser: Usuarios;

  // Tipos muebles (Many) -> Usuario actualizardor (One)
  @ManyToOne(() => Usuarios, usuario => usuario.tipos_muebles)
  updatorUser: Usuarios;

}