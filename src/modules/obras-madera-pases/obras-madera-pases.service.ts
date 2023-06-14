import { Injectable, NotFoundException } from '@nestjs/common';
import { ObrasMaderaPases } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ObrasMadera } from '../obras-madera/entities';
import { ObrasMaderaMotivosPases } from '../obras-madera-motivos-pases/entities';

@Injectable()
export class ObrasMaderaPasesService {

  constructor(
    @InjectRepository(ObrasMaderaMotivosPases) private readonly motivosRepository: Repository<ObrasMaderaMotivosPases>,
    @InjectRepository(ObrasMaderaPases) private readonly pasesRepository: Repository<ObrasMaderaPases>,
    @InjectRepository(ObrasMadera) private readonly obrasMaderaRepository: Repository<ObrasMadera>,
  ) { }

  // Pase por ID
  async getId(id: number): Promise<ObrasMaderaPases> {

    const pase = await this.pasesRepository.findOne({ relations: {
      obra_madera: true,
      motivo: true,
      creatorUser: true,
      updatorUser: true
    }, where: { id } });
    if (!pase) throw new NotFoundException('El pase no existe');
    return pase;

  }

  // Listar pases
  async getAll({
    columna = 'id',
    direccion = -1,
    activo = '',
    parametro = '',
    desde = 0,
    cantidadItems = 1000000,
    obra_madera = '',
  }: any): Promise<any> {

    // Ordenando datos
    let order = {};
    order[columna] = Number(direccion);

    // Filtrando datos
    let where = [];

    if(obra_madera || obra_madera !== '') 
    where.push({ obra_madera: { id: obra_madera } });

    const totalItems = await this.pasesRepository.count({ where });

    const pases = await this.pasesRepository
      .find({
        relations: {
          obra_madera: true,
          motivo: true,
          creatorUser: true,
          updatorUser: true
        },
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      pases,
      totalItems
    };

  }

  // Crear pase
  async insert(pasesDTO: any): Promise<ObrasMaderaPases> {

    // UpperCase
    pasesDTO.observacion = pasesDTO.observacion?.toUpperCase().trim();

    // Verificacion: Tipo de motivo especial -> AVANCE DE OBRA
    if(pasesDTO.tipo === 'Adelante'){
      const motivoAdelante = await this.motivosRepository.findOne({ where: { descripcion: 'AVANCE DE OBRA' } });
      if(motivoAdelante){
        pasesDTO.motivo = motivoAdelante.id;
      }else{
        const motivoAdelanteDB: any = await this.motivosRepository.save({
          descripcion: 'AVANCE DE OBRA',
          creatorUser: pasesDTO.creatorUser,
          updatorUser: pasesDTO.updatorUser
        });
        pasesDTO.motivo = motivoAdelanteDB.id;
      }     
    }

    // Generando nuevo pase
  
    let dataObra: any = { estado: pasesDTO.etapa_actual }

    // Actualizando fecha de finalizacion -> Cuando corresponda
    if(pasesDTO.etapa_actual === 'Finalizada') dataObra.fecha_finalizacion = new Date();

    const [nuevoPaseDB, __] = await Promise.all([
      this.pasesRepository.save(pasesDTO),
      this.obrasMaderaRepository.update({ id: pasesDTO.obra_madera }, dataObra)
    ])
    
    let paseDB: any = nuevoPaseDB;
    
    return this.getId(paseDB.id);

  }

  // Actualizar pase
  async update(id: number, pasesUpdateDTO: any): Promise<any> {

    // UpperCase
    pasesUpdateDTO.observacion = pasesUpdateDTO.observacion?.toUpperCase().trim();

    const paseDB = await this.pasesRepository.findOneBy({ id });

    // Verificacion: El pase no existe
    if (!paseDB) throw new NotFoundException('El pase no existe');

    await this.pasesRepository.update({ id }, pasesUpdateDTO);
    return this.getId(id);

  }

}
