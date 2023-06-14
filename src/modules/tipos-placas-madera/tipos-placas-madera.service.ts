import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TiposPlacasMadera } from './entities';

@Injectable()
export class TiposPlacasMaderaService {

  constructor(
    @InjectRepository(TiposPlacasMadera) private readonly tiposRepository: Repository<TiposPlacasMadera>
  ) { }

  // Tipo por ID
  async getId(id: number): Promise<TiposPlacasMadera> {

    const tipo = await this.tiposRepository.findOne({ relations: ['creatorUser', 'updatorUser'], where: { id } });
    if (!tipo) throw new NotFoundException('El tipo de placa no existe');
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
    let campos = ['descripcion', 'codigo'];

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
  async insert(tiposDTO: any): Promise<TiposPlacasMadera[]> {

    // Uppercase y Lowercase
    tiposDTO.codigo = tiposDTO.codigo?.toLocaleUpperCase().trim();
    tiposDTO.descripcion = tiposDTO.descripcion?.toLocaleUpperCase().trim();

    const { descripcion, codigo } = tiposDTO;

    // Verificacion: Codigo repetido
    let codigoDB = await this.tiposRepository.findOneBy({ codigo });
    if (codigoDB) throw new NotFoundException('El código ya se encuentra cargado');

    // Verificacion: Descripcion repetida
    let tipoDB = await this.tiposRepository.findOneBy({ descripcion });
    if (tipoDB) throw new NotFoundException('La descripción ya se encuentra cargada');

    return await this.tiposRepository.save(tiposDTO);

  }

  // Actualizar tipo
  async update(id: number, tiposUpdateDTO: any): Promise<any> {

    // Uppercase y Lowercase
    tiposUpdateDTO.codigo = tiposUpdateDTO.codigo?.toLocaleUpperCase().trim();
    tiposUpdateDTO.descripcion = tiposUpdateDTO.descripcion?.toLocaleUpperCase().trim();

    const { descripcion, codigo } = tiposUpdateDTO;

    const tipoDB = await this.tiposRepository.findOneBy({ id });

    // Verificacion: El tipo no existe
    if (!tipoDB) throw new NotFoundException('El tipo de placa no existe');

    // Verificacion: Codigo repetido
    if (codigo) {
      const codigoRepetido = await this.tiposRepository.findOneBy({ codigo })
      if (codigoRepetido && codigoRepetido.id !== id) throw new NotFoundException('El código ya se encuentra cargado');
    }

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.tiposRepository.findOneBy({ descripcion })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    await this.tiposRepository.update({ id }, tiposUpdateDTO);
    return this.getId(id);

  }

}
