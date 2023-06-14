import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObrasMaderaMotivosPases } from './entities';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ObrasMaderaMotivosPasesService {

  constructor(
    @InjectRepository(ObrasMaderaMotivosPases) private readonly motivosRepository: Repository<ObrasMaderaMotivosPases>
  ) { }

  // Motivo por ID
  async getId(id: number): Promise<ObrasMaderaMotivosPases> {

    const motivo = await this.motivosRepository.findOne({ relations: ['creatorUser', 'updatorUser'], where: { id } });
    if (!motivo) throw new NotFoundException('El motivo no existe');
    return motivo;

  }

  // Listar motivos
  async getAll({
    columna = 'descripcion',
    direccion = 1,
    activo = '',
    parametro = '',
    desde = 0,
    cantidadItems = 100000
  }: any): Promise<any> {

    // Ordenando datos
    let order = {};
    order[columna] = Number(direccion);

    // Filtrando datos
    let where = [];
    let campos = ['descripcion'];

    campos.forEach(campo => {

      const filtro = {};

      filtro[campo] = Like('%' + parametro?.toUpperCase() + '%');

      if (activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;

      where.push(filtro)

    })

    const totalItems = await this.motivosRepository.count({ where });

    const motivos = await this.motivosRepository
      .find({
        relations: ['creatorUser', 'updatorUser'],
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      motivos: motivos.filter( motivo => motivo.descripcion !== 'AVANCE DE OBRA' ), // Se elimina el tipo especial
      totalItems
    };

  }

  // Crear motivo
  async insert(motivosDTO: any): Promise<ObrasMaderaMotivosPases[]> {

    // Uppercase y Lowercase
    motivosDTO.descripcion = motivosDTO.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = motivosDTO;

    // Verificacion: Motivo repetido
    let motivoDB = await this.motivosRepository.findOneBy({ descripcion });
    if (motivoDB) throw new NotFoundException('El motivo ya se encuentra cargado');

    return await this.motivosRepository.save(motivosDTO);

  }

  // Actualizar motivo
  async update(id: number, motivosUpdateDTO: any): Promise<any> {

    // Uppercase y Lowercase
    motivosUpdateDTO.descripcion = motivosUpdateDTO.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = motivosUpdateDTO;

    const motivosDB = await this.motivosRepository.findOneBy({ id });

    // Verificacion: El motivo no existe
    if (!motivosDB) throw new NotFoundException('El motivo no existe');

    // Verificacion: Motivo repetido
    if (descripcion) {
      const descripcionRepetida = await this.motivosRepository.findOneBy({ descripcion })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('El motivo ya se encuentra cargado');
    }

    motivosUpdateDTO.descripcion = descripcion?.toLocaleUpperCase();

    await this.motivosRepository.update({ id }, motivosUpdateDTO);
    return this.getId(id);

  }

}
