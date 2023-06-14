import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../usuarios/entities';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class InicializacionService {

  constructor(
    @InjectRepository(Usuarios) private readonly usuariosRepository: Repository<Usuarios>,
  ){}

  async inicializacion(): Promise<any> {

    // 1) - Verificacion
    const verificacion = await this.usuariosRepository.find();
    if (verificacion.length != 0) throw new NotFoundException('El sistema ya fue inicializado');

    // 2) - Se crea usuario administrador
    const data: any = {
      usuario: 'admin',
      apellido: 'ADMIN',
      nombre: 'ADMIN',
      dni: '34060390',
      email: 'admin@gmail.com',
      role: 'ADMIN_ROLE',
      activo: true
    }

    // Generacion de password encriptado
    const salt = bcryptjs.genSaltSync();
    data.password = bcryptjs.hashSync('admin', salt);

    // Se crea y se almacena en la base de datos al usuario administrador    
    return await this.usuariosRepository.save(data);

  }


}
