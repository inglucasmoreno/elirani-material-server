import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "../../../database/base.entity";
import { IClientes } from "../../../interfaces";
import { ObrasMadera } from "../../../modules/obras-madera/entities";
import { Usuarios } from "../../../modules/usuarios/entities";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Clientes extends BaseEntity implements IClientes {

  @Column({ // Apellido y Nombre | Razon social
    nullable: false,
    type: 'varchar',
    length: 100
   })
  descripcion: string;

  @Column({ 
    nullable: false,
    enum: ['CUIL', 'CUIT', 'DNI'] 
  })
  tipo_identificacion: string;

  @Column({ 
    default: '',
    unique: true,
    type: 'varchar',
    length: 100
   })
  identificacion: string;

  @Column({ 
    type: 'varchar',
    default: '',
    length: 100
  })
  telefono: string;

  @Column({
    type: 'varchar',
    default: '',
    length: 100
  })
  direccion: string;

  @Column({ 
    type: 'varchar',
    default: '',
    length: 100
  })
  email: string;

  // Cliente (One) -> Obras (Many)
  @OneToMany(() => ObrasMadera, obras_madera => obras_madera.cliente)
  obras_madera: ObrasMadera[];

  // Clientes (Many) -> Usuario creador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.clientes)
  creatorUser: Usuarios;

  // Clientes (Many) -> Usuario actualizador (One)
  @ManyToOne(() => Usuarios, usuario => usuario.clientes)
  updatorUser: Usuarios;


}