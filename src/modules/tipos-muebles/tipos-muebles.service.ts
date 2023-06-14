import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TiposMuebles } from './entities';

@Injectable()
export class TiposMueblesService {

  constructor(
    @InjectRepository(TiposMuebles) private readonly tiposRepository: Repository<TiposMuebles>
  ) { }

  // Tipo por ID
  async getId(id: number): Promise<TiposMuebles> {

    const tipo = await this.tiposRepository.findOne({ relations: ['creatorUser', 'updatorUser'], where: { id } });
    if (!tipo) throw new NotFoundException('El tipo de mueble no existe');
    return tipo;

  }

  // Listar tipos
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
    let campos = ['descripcion'];

    campos.forEach(campo => {
      const filtro = {};
      filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
      if (activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
      where.push(filtro)
    })

    const totalItems = await this.tiposRepository.count({ where });

    const tipos = await this.tiposRepository
      .find({
        relations: ['creatorUser', 'updatorUser'],
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      tipos,
      totalItems
    };

  }

  // Crear tipo
  async insert(tiposDTO: any): Promise<TiposMuebles[]> {

    // Uppercase y Lowercase
    tiposDTO.descripcion = tiposDTO.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = tiposDTO;

    // Verificacion: Tipo de mueble repetido
    let tipoDB = await this.tiposRepository.findOneBy({ descripcion });
    if (tipoDB) throw new NotFoundException('El tipo de mueble ya se encuentra cargado');

    return await this.tiposRepository.save(tiposDTO);

  }

  // Actualizar tipo
  async update(id: number, tiposUpdateDTO: any): Promise<any> {

    // Uppercase y Lowercase
    tiposUpdateDTO.descripcion = tiposUpdateDTO.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = tiposUpdateDTO;

    const tipoDB = await this.tiposRepository.findOneBy({ id });

    // Verificacion: El tipo no existe
    if (!tipoDB) throw new NotFoundException('El tipo de mueble no existe');

    // Verificacion: Tipo de placa repetido
    if (descripcion) {
      const descripcionRepetida = await this.tiposRepository.findOneBy({ descripcion })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('El tipo de mueble ya se encuentra cargado');
    }

    tiposUpdateDTO.descripcion = descripcion?.toLocaleUpperCase();

    await this.tiposRepository.update({ id }, tiposUpdateDTO);
    return this.getId(id);

  }

}
