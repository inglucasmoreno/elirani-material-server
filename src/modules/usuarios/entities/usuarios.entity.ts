import { USUARIOS_ROLES } from "src/constants";
import { BaseEntity } from "../../../database/base.entity";
import { IUsuarios } from "../../../interfaces";
import { Clientes } from "../../../modules/clientes/entities";
import { MueblesPlacas } from "../../../modules/muebles-placas/entities";
import { ObrasMadera } from "../../../modules/obras-madera/entities";
import { TiposMuebles } from "../../../modules/tipos-muebles/entities";
import { TiposPlacasMadera } from "../../../modules/tipos-placas-madera/entities/tipos-placas-madera.entity";
import { UsuariosPermisos } from "../../../modules/usuarios-permisos/entities";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'usuarios' })
export class Usuarios extends BaseEntity implements IUsuarios {

  @Column({ 
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 50
   })
  usuario: string;

  @Column({ 
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 50
  })
  dni: string;

  @Column({ 
    nullable: false,
    type: 'varchar',
    length: 50
   })
  apellido: string;

  @Column({ 
    nullable: false,
    type: 'varchar',
    length: 50
  })
  nombre: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  password: string;

  @Column({ 
    nullable: true,
    type: 'varchar',
    length: 50 
  })
  email: string;

  @Column({ 
    enum: USUARIOS_ROLES,
    default: 'ADMIN_ROLE'
  })
  role: USUARIOS_ROLES;

  @OneToMany(() => UsuariosPermisos, permisos => permisos.usuario)
  permisos: UsuariosPermisos[]

  @OneToMany(() => Clientes, () => {})
  clientes: Clientes[]

  @OneToMany(() => TiposPlacasMadera, () => {})
  tipos_placas_madera: TiposPlacasMadera[]

  @OneToMany(() => TiposMuebles, () => {})
  tipos_muebles: TiposMuebles[]

  @OneToMany(() => ObrasMadera, () => {})
  obras_madera: ObrasMadera[]

  @OneToMany(() => MueblesPlacas, () => {})
  muebles_placas: MueblesPlacas[]

}