import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Clientes } from '../clientes/entities';
import { ObrasMadera } from './entities';
import { Muebles } from '../muebles/entities';

@Injectable()
export class ObrasMaderaService {

  constructor(
    @InjectRepository(ObrasMadera) private readonly obrasRepository: Repository<ObrasMadera>
  ) { }

  // Obra por ID
  async getId(id: number): Promise<any> {

    const obra = await this.obrasRepository.findOne({
      relations:
      {
        cliente: true,
        muebles: {
          tipo_mueble: true,
          muebles_placas: {
            tipo_placa_madera: true
          }
        },
        ordenes_mantenimiento: true,
        creatorUser: true,
        updatorUser: true
      },
      order: {
        ordenes_mantenimiento: { id: -1 },
        muebles: { id: -1 }
      },
      where: { id }
    });

    if (!obra) throw new NotFoundException('La obra no existe');

    return {
      obra
    }

  }

  // Listar obras
  async getAll({
    columna,
    direccion,
    activo,
    parametro,
    desde,
    cantidadItems,
    estado
  }: any): Promise<any> {

    // Ordenando datos
    let order = {};
    order[columna] = Number(direccion);

    // Filtrando datos
    let where = [];

    where = [
      { codigo: parametro ? parametro : 0 },
      {
        cliente: { descripcion: Like('%' + parametro.toUpperCase() + '%') },
        estado: !estado || estado === '' ? null : estado
      },
      {
        cliente: { identificacion: parametro },
        estado: !estado || estado === '' ? null : estado
      }
    ];

    const totalItems = await this.obrasRepository.count({ where });

    const obras = await this.obrasRepository
      .find({
        relations: ['cliente', 'creatorUser', 'updatorUser'],
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      obras,
      totalItems
    };

  }

  // Crear obra
  async insert(obrasDTO: any): Promise<ObrasMadera[]> {

    // Uppercase y Lowercase
    obrasDTO.descripcion = obrasDTO.descripcion?.toLocaleUpperCase().trim();
    obrasDTO.codigo = obrasDTO.codigo?.toLocaleUpperCase().trim();
    obrasDTO.direccion = obrasDTO.direccion?.toLocaleUpperCase().trim();

    // Verificacion: Codigo de obra repetido
    const obraDB = await this.obrasRepository.findOneBy({ codigo: obrasDTO.codigo });
    if (obraDB) throw new NotFoundException('El código de obra ya se encuentra cargado');

    return await this.obrasRepository.save(obrasDTO);

  }

  // Actualizar obra
  async update(id: number, obrasUpdateDTO: any): Promise<any> {

    // Uppercase y Lowercase
    obrasUpdateDTO.descripcion = obrasUpdateDTO.descripcion?.toLocaleUpperCase().trim();
    obrasUpdateDTO.codigo = obrasUpdateDTO.codigo?.toLocaleUpperCase().trim();
    obrasUpdateDTO.direccion = obrasUpdateDTO.direccion?.toLocaleUpperCase().trim();

    const { codigo } = obrasUpdateDTO;

    const obraDB = await this.obrasRepository.findOneBy({ id });

    // Verificacion: La obra no existe
    if (!obraDB) throw new NotFoundException('La obra no existe');

    // Verificacion: Codigo de obra repetido
    if (codigo) {
      const codigoRepetido = await this.obrasRepository.findOneBy({ codigo })
      if (codigoRepetido && codigoRepetido.id !== id) throw new NotFoundException('El código ya se encuentra cargado');
    }

    await this.obrasRepository.update({ id }, obrasUpdateDTO);
    return this.getId(id);

  }

  // Pase de obra -> Adelante
  async paseAdelante(id: number): Promise<any> {

    const obraDB = await this.obrasRepository.findOneBy({ id });

    // Verificacion: La obra no existe
    if (!obraDB) throw new NotFoundException('La obra no existe');

    let proximaEtapa = '';

    if (obraDB?.estado === 'Pendiente') proximaEtapa = 'Produccion';
    else if (obraDB?.estado === 'Produccion') proximaEtapa = 'Colocacion';
    else if (obraDB?.estado === 'Colocacion') proximaEtapa = 'Finalizada';

    await this.obrasRepository.update({ id }, { estado: proximaEtapa });

    return this.getId(id);

  }

  // Pase de obra -> Atras
  async paseAtras(id: number): Promise<any> {

    const obraDB = await this.obrasRepository.findOneBy({ id });

    // Verificacion: La obra no existe
    if (!obraDB) throw new NotFoundException('La obra no existe');

    let proximaEtapa = '';

    if (obraDB?.estado === 'Produccion') proximaEtapa = 'Pendiente';
    else if (obraDB?.estado === 'Colocacion') proximaEtapa = 'Produccion';
    else if (obraDB?.estado === 'Finalizada') proximaEtapa = 'Colocacion';

    await this.obrasRepository.update({ id }, { estado: proximaEtapa });

    return this.getId(id);

  }

  // Eliminar obra
  async delete(id: number): Promise<any> {
    await this.obrasRepository.delete(id);
    return 'Obra eliminada correctamente';
  }

}
