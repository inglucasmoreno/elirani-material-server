import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MueblesPlacas } from './entities';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MueblesPlacasService {

  constructor(
    @InjectRepository(MueblesPlacas) private readonly relacionesRepository: Repository<MueblesPlacas>
  ) { }

  // Relacion por ID
  async getId(id: number): Promise<MueblesPlacas> {
    const relacion = await this.relacionesRepository.findOne({ 
      relations: {
        tipo_placa_madera: true,
        creatorUser: true,
        updatorUser: true
      }, 
      where: { id } 
    });
    if (!relacion) throw new NotFoundException('La relacion no existe');
    return relacion;
  }

  // Listar relaciones
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

    const totalItems = await this.relacionesRepository.count({ where });

    const relaciones = await this.relacionesRepository
      .find({
        relations: ['creatorUser', 'updatorUser'],
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      relaciones,
      totalItems
    };

  }

  // Crear relacion
  async insert(relacionesDTO: any): Promise<any> {
    const relacionDB: any = await this.relacionesRepository.save(relacionesDTO);
    return this.getId(relacionDB.id);
  }

  // Actualizar relacion
  async update(id: number, relacionesUpdateDTO: any): Promise<any> {
    await this.relacionesRepository.update({ id }, relacionesUpdateDTO);
    return this.getId(id);
  }

  // Eliminar relacion
  async delete(id: number): Promise<any> {
    await this.relacionesRepository.delete(id);
    return 'Relacion eliminada correctamente';
  }

}
