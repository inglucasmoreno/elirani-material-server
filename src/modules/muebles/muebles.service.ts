import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Muebles } from './entities';
import { ObrasMadera } from '../obras-madera/entities';
import { MueblesPlacas } from '../muebles-placas/entities';

@Injectable()
export class MueblesService {

  constructor(
    @InjectRepository(Muebles) private readonly mueblesRepository: Repository<Muebles>,
    @InjectRepository(ObrasMadera) private readonly obrasMaderaRepository: Repository<Muebles>,
    @InjectRepository(MueblesPlacas) private readonly mueblesPlacasRepository: Repository<MueblesPlacas>,
  ) { }

  // Mueble por ID
  async getId(id: number): Promise<Muebles> {
    const mueble = await this.mueblesRepository.findOne({
      relations: {
        tipo_mueble: true,
        muebles_placas: {
          tipo_placa_madera: true  
        },
        creatorUser: true,
        updatorUser: true
      },
      where: { id } });
    if (!mueble) throw new NotFoundException('El mueble no existe');
    return mueble;
  }

  // Listar de muebles
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

    const totalItems = await this.mueblesRepository.count({ where });

    const muebles = await this.mueblesRepository
      .find({
        relations: {
          tipo_mueble: true,
          muebles_placas: {
            tipo_placa_madera: true  
          },
          creatorUser: true,
          updatorUser: true
        },
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      muebles,
      totalItems
    };

  }

  // Crear mueble
  async insert(mueblesDTO: any): Promise<any> {

    const { obra_madera, placas } = mueblesDTO;
  
    // Se inserta el nuevo mueble

    mueblesDTO.observaciones = mueblesDTO.observaciones.toUpperCase().trim();

    const muebleDB: any = await this.mueblesRepository.save(mueblesDTO);
    
    // Se actualiza el precio de la obra
    let { precio_obra } = await this.mueblesRepository
                              .createQueryBuilder("mueble")
                              .select("SUM(mueble.precio)", "precio_obra")
                              .where("mueble.obra_id = :id", { id: obra_madera })
                              .getRawOne()
     
    precio_obra = precio_obra ? precio_obra : 0;                          

    await this.obrasMaderaRepository.update({ id: obra_madera }, { precio: precio_obra });

    // Se agregan las placas al mueble
    for (const placa of placas) {
      
      const data = {
        mueble: muebleDB.id,
        cantidad: placa.cantidad,
        tipo_placa_madera: placa.tipo_placa_madera, 
        creatorUser: mueblesDTO.creatorUser,
        updatorUser: mueblesDTO.updatorUser,
      } 

      await await this.mueblesPlacasRepository.save(data);

    }

    return {
      mueble: await this.getId(muebleDB.id),
      precio_obra     
    }
  
  }

  // Actualizar mueble
  async update(id: number, mueblesUpdateDTO: any): Promise<any> {

    const { tipo_mueble, precio, muebleConPlacas, observaciones, updatorUser } = mueblesUpdateDTO;

    mueblesUpdateDTO.observaciones = mueblesUpdateDTO.observaciones.toUpperCase().trim();

    const muebleDB = await this.mueblesRepository.findOne({ 
      relations: {
        obra_madera: true
      },
      where: { id } 
    });

    // Verificacion: El mueble no existe
    if (!muebleDB) throw new NotFoundException('El mueble no existe');

    const data = {
      tipo_mueble,
      precio,
      observaciones,
      updatorUser
    }

    await this.mueblesRepository.update({ id }, data);

    // Se borran las placas
    if(!muebleConPlacas) this.mueblesPlacasRepository.delete({ mueble: { id } });

    // Se actualiza el precio de la obra
   
    const idObra = muebleDB.obra_madera.id;
    
    let { precio_obra } = await this.mueblesRepository
                              .createQueryBuilder("mueble")
                              .select("SUM(mueble.precio)", "precio_obra")
                              .where("mueble.obra_id = :id", { id: idObra })
                              .getRawOne()
     
    precio_obra = precio_obra ? precio_obra : 0;                          

    await this.obrasMaderaRepository.update({ id: idObra }, { precio: precio_obra });

    return {
      mueble: await this.getId(id),
      precio_obra
    }
    
  }

  // Eliminar mueble
  async delete(id: number): Promise<any> {

    // Verificacion: El mueble existe
    const muebleDB = await this.mueblesRepository.findOne({ relations: { obra_madera: true }, where: { id } });
    if(!muebleDB) throw new NotFoundException('El mueble no existe');

    await this.mueblesRepository.delete(id);

    // Se actualiza el precio de la obra
   
    let { precio_obra } = await this.mueblesRepository
                              .createQueryBuilder("mueble")
                              .select("SUM(mueble.precio)", "precio_obra")
                              .where("mueble.obra_id = :id", { id: muebleDB.obra_madera.id })
                              .getRawOne()
        
    precio_obra = precio_obra ? precio_obra : 0;                          

    await this.obrasMaderaRepository.update({ id: muebleDB.obra_madera.id }, { precio: precio_obra });

    return {
      precio_obra
    };

  }

}
