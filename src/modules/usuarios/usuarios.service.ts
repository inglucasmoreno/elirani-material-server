import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CambioPasswordDTO, UsuariosDTO } from './dto';
import { Usuarios } from './entities';
import * as bcryptjs from 'bcryptjs';
import { UsuariosPermisos } from '../usuarios-permisos/entities';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuarios) private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(UsuariosPermisos) private readonly permisosRepository: Repository<UsuariosPermisos>,
  ) { }

  // Usuario por ID
  async getUsuario(id: number): Promise<Usuarios> {
    const usuario: any = await this.usuariosRepository.find({ relations: { permisos: true }, where: { id } });
    if (!usuario[0]) throw new NotFoundException('El usuario no existe');
    return usuario[0];
  }

  // Usuario por nombre de usuario
  async getUsuarioPorNombre(nombreUsuario: string): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.find({
      relations: { permisos: true },
      where: [{ usuario: nombreUsuario, activo: true }]
    });
    return usuario[0];
  }

  // Usuario por DNI
  async getUsuarioPorDNI(dni: string): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.findOneBy({ dni, activo: true });
    return usuario;
  }

  // Usuario por email
  async getUsuarioPorEmail(email: string): Promise<Usuarios> {
    email = email.toLocaleLowerCase();
    const usuario = await this.usuariosRepository.findOneBy({ email, activo: true });
    return usuario;
  }

  // Listar usuario
  async listarUsuarios({ columna, direccion }: any): Promise<Usuarios[]> {

    let order = {};
    order[columna] = direccion;

    let parametros: any = { order };

    const usuarios = await this.usuariosRepository.find(parametros);

    return usuarios;

  }

  // Crear usuario
  async crearUsuario(usuariosDTO: UsuariosDTO): Promise<Usuarios> {

    const { permisos } = usuariosDTO;

    // Uppercase y Lowercase
    usuariosDTO.apellido = usuariosDTO.apellido.toLocaleUpperCase();
    usuariosDTO.nombre = usuariosDTO.nombre.toLocaleUpperCase();
    usuariosDTO.email = usuariosDTO.email = usuariosDTO.email.toLocaleLowerCase();

    const { usuario, dni, email } = usuariosDTO;

    // Verificacion: Nombre de usuario repetido
    let usuarioDB = await this.usuariosRepository.findOneBy({ usuario });
    if (usuarioDB) throw new NotFoundException('El nombre de usuario ya se encuentra registrado');

    // Verificacion: Numero de DNI repetido
    usuarioDB = await this.getUsuarioPorDNI(dni);
    if (usuarioDB) throw new NotFoundException('El DNI ya se encuentra registrado');

    // Verificacion: Correo electronico repetido
    usuarioDB = await this.getUsuarioPorEmail(email);
    if (usuarioDB) throw new NotFoundException('El email ya se encuentra registrado');

    const nuevoUsuarioDB: any = await this.usuariosRepository.save(usuariosDTO);

    // Se adicionan los permisos al usuarios
    await Promise.all(
      permisos.map(async ({ alcance, permiso, creatorUser, updatorUser }) => {
        const dataPermiso = {
          usuario: nuevoUsuarioDB.id,
          alcance,
          permiso,
          creatorUser,
          updatorUser,
        };
        await this.permisosRepository.save(dataPermiso);
      })
    );

    return nuevoUsuarioDB;
  }

  // Actualizar usuario
  async actualizarUsuario(id: any, usuariosUpdateDTO: any): Promise<any> {

    const {
      usuario,
      apellido,
      nombre,
      dni,
      email,
      role,
      activo,
      permisos = []
    } = usuariosUpdateDTO;

    const data = {
      usuario,
      apellido,
      nombre,
      dni,
      email,
      role,
      activo,
    }

    // Actualizacion de datos de usuario
    await this.usuariosRepository.update({ id }, data);

    // Actualizacion de permisos
    await Promise.all(
      permisos.map(async ({ alcance, permiso, creatorUser, updatorUser }) => {


        const permisoDB = await this.permisosRepository.findOne({ where: [{ usuario: { id }, alcance }] });

        if (permisoDB) {  // Si existe y es distinto se actualiza

          if(permisoDB.permiso !== permiso){

            const dataPermiso = {
              permiso,
              updatorUser
            }
  
            await this.permisosRepository.update({ id: permisoDB.id }, dataPermiso);
          
          }

        } else { // Si no existe se crea

          const dataPermiso = {
            usuario: id,
            alcance,
            permiso,
            creatorUser,
            updatorUser
          };

          await this.permisosRepository.save(dataPermiso);

        }

      })
    );

    return this.getUsuario(id);

  }

  // Actualizar password perfil
  async actualizarPasswordPerfil(id: number, { password_actual, password_nuevo, password_nuevo_repetir }: CambioPasswordDTO): Promise<String> {

    // Datos de usuario
    const usuarioDB = await this.usuariosRepository.findOneBy({ id });

    // Verificacion - Password actual correcto
    const passwordValido = bcryptjs.compareSync(password_actual, usuarioDB.password);

    if (!usuarioDB || !passwordValido) throw new NotFoundException('La contraseña actual no coincide');

    // Verificacion - Nuevo password
    if (password_nuevo !== password_nuevo_repetir) throw new NotFoundException('Debe repetir correctamente la contraseña');

    // Actualizando contraseña
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(password_nuevo, salt);

    await this.usuariosRepository.update({ id }, { password });
    return 'Actualizacion correcta';

  }


}
