import { BaseEntity } from "../../../database/base.entity";
import { IObrasMadera } from "../../../interfaces";
import { Clientes } from "../../../modules/clientes/entities";
import { Muebles } from "../../../modules/muebles/entities";
import { ObrasMaderaPases } from "../../../modules/obras-madera-pases/entities";
import { OrdenesMantenimientoMadera } from "../../../modules/ordenes-mantenimiento-madera/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ObrasMadera extends BaseEntity implements IObrasMadera {

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 50
  })
  codigo: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 150
  })
  descripcion: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 150
  })
  direccion: string;

  @Column({
    type: 'varchar',
    default: 'Pendiente',
    length: 100
  })
  estado: string;

  @Column({
    default: 0,
    type: 'float'
  })
  precio: number;

  @Column()
  fecha_inicio: Date;

  @Column({
    default: new Date()
  })
  fecha_finalizacion: Date;

  @Column()
  fecha_finalizacion_estimada: Date;

  // Obras (Many) -> Cliente (One)
  @ManyToOne(() => Clientes, clientes => clientes.obras_madera)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Clientes;

  // Obra (One) -> Pases (Many)
  @OneToMany(() => ObrasMaderaPases, pases => pases.obra_madera, { onDelete: "CASCADE" })
  pases: ObrasMaderaPases[];

  // Obra (One) -> Muebles (Many)
  @OneToMany(() => Muebles, mueble => mueble.obra_madera, { onDelete: "CASCADE" })
  muebles: Muebles[];

  // Obra (One) -> Orden de mantenimiento (Many)
  @OneToMany(() => OrdenesMantenimientoMadera, ordenes_mantenimiento => ordenes_mantenimiento.obra_madera, { onDelete: "CASCADE" })
  ordenes_mantenimiento: OrdenesMantenimientoMadera[];

  // Obras (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.obras_madera)
  creatorUser: Usuarios;

  // Obras (Many) -> Usuarios actualizador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.obras_madera)
  updatorUser: Usuarios;

}