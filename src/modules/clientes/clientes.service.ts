import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Clientes } from './entities';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Clientes) private readonly clientesRepository: Repository<Clientes>
  ) { }

  // Cliente por ID
  async getId(id: number): Promise<Clientes> {

    const cliente = await this.clientesRepository.findOne({ relations: ['creatorUser', 'updatorUser'], where: { id } });
    if (!cliente) throw new NotFoundException('El cliente no existe');
    return cliente;

  }

  // Cliente por Identificacion
  async getPorIdentificacion(identificacion: string): Promise<Clientes> {

    const cliente = await this.clientesRepository.findOne({ relations: ['creatorUser', 'updatorUser'], where: { identificacion} });
    return cliente;

  }

  // Listar todas los clientes
  async getAll({ 
    columna, 
    direccion, 
    activo,
    parametro,
    desde, 
    cantidadItems 
  }: any): Promise<any> {

    // Ordenando datos
    let order = {};
    order[columna] = Number(direccion);

    // Filtrando datos
    let where = [];
    let campos = ['descripcion', 'identificacion'];

    campos.forEach( campo => {
      const filtro = {};
      filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
      if(activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
      where.push(filtro)  
    })

    const totalItems = await this.clientesRepository.count({where});    

    const clientes = await this.clientesRepository
                               .find({ 
                                  relations: ['creatorUser', 'updatorUser'], 
                                  order, 
                                  skip: Number(desde), 
                                  take: Number(cantidadItems),
                                  where
                                });

    return {
      clientes,
      totalItems
    };

  }

  // Crear cliente
  async insert(clientesDTO: any): Promise<Clientes[]> {

    // Uppercase y Lowercase
    clientesDTO.descripcion = clientesDTO.descripcion?.toLocaleUpperCase().trim();
    clientesDTO.direccion = clientesDTO.direccion?.toLocaleUpperCase().trim();
    clientesDTO.email = clientesDTO.email?.toLocaleLowerCase().trim();

    const { identificacion } = clientesDTO;

    // Verificacion: cliente repetido - Identificacion
    if(identificacion !== ''){
      let clienteDB = await this.clientesRepository.findOneBy({ identificacion });
      if (clienteDB) throw new NotFoundException('La identificacion ya se encuentra cargada');
    }

    return await this.clientesRepository.save(clientesDTO);

  }

  // Actualizar cliente
  async update(id: number, clientesUpdateDTO: any): Promise<any> {

    const { descripcion, identificacion, direccion, email } = clientesUpdateDTO;

    const clienteDB = await this.clientesRepository.findOneBy({ id });

    // Verificacion: El cliente no existe
    if (!clienteDB) throw new NotFoundException('El cliente no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.clientesRepository.findOneBy({ descripcion: descripcion.toLocaleUpperCase().trim() })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La razon social ya se encuentra cargada');
    }

    // Verificacion: Identificacion repetida
    if (identificacion && identificacion !== '') {
      const identificacionRepetida = await this.clientesRepository.findOneBy({ identificacion: identificacion.trim() })
      if (identificacionRepetida && identificacionRepetida.id !== id) throw new NotFoundException('La identificacion ya se encuentra cargada');
    }

    clientesUpdateDTO.descripcion = descripcion?.toLocaleUpperCase();
    clientesUpdateDTO.direccion = direccion?.toLocaleUpperCase();
    clientesUpdateDTO.email = email?.toLocaleLowerCase();

    await this.clientesRepository.update({ id }, clientesUpdateDTO);
    return this.getId(id);

  }

}
