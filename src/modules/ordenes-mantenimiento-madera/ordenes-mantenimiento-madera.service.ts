import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdenesMantenimientoMadera } from './entities';
import { Like, Repository } from 'typeorm';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { format } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdenesMantenimientoMaderaService {

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(OrdenesMantenimientoMadera) private readonly ordenesRepository: Repository<OrdenesMantenimientoMadera>
  ) { }

  // Orden por ID
  async getId(id: number): Promise<OrdenesMantenimientoMadera> {

    const Orden = await this.ordenesRepository.findOne({
      relations: {
        obra_madera: true,
        creatorUser: true,
        updatorUser: true
      },
      where: { id }
    });

    if (!Orden) throw new NotFoundException('La orden no existe');
    return Orden;

  }

  // Listar ordenes
  async getAll({
    columna = 'createdAt',
    direccion = -1,
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
    let campos = ['observaciones'];

    campos.forEach(campo => {
      const filtro = {};
      filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
      if (activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
      where.push(filtro)
    })

    const totalItems = await this.ordenesRepository.count({ where });

    const ordenes = await this.ordenesRepository
      .find({
        relations: {
          obra_madera: true,
          creatorUser: true,
          updatorUser: true
        },
        order,
        skip: Number(desde),
        take: Number(cantidadItems),
        where
      });

    return {
      ordenes,
      totalItems
    };

  }

  // Crear orden de mantenimiento
  async insert(ordenDTO: any): Promise<OrdenesMantenimientoMadera[]> {

    // Uppercase y Lowercase
    ordenDTO.observaciones = ordenDTO.observaciones?.toLocaleUpperCase().trim();

    return this.ordenesRepository.save(ordenDTO);

  }

  // Actualizar orden
  async update(id: number, ordenesUpdateDTO: any): Promise<any> {

    // Uppercase
    ordenesUpdateDTO.observaciones = ordenesUpdateDTO.observaciones?.toLocaleUpperCase().trim();

    const ordenDB = await this.ordenesRepository.findOneBy({ id });

    // Verificacion: La orden no existe
    if (!ordenDB) throw new NotFoundException('La orden no existe');

    await this.ordenesRepository.update({ id }, ordenesUpdateDTO);
    return this.getId(id);

  }

  // Eliminar orden
  async delete(id: number): Promise<any> {
    await this.ordenesRepository.delete(id);
    return 'Orden eliminada correctamente';
  }

  // Imprimir orden
  async imprimir(id: number): Promise<any> {

    console.log(this.configService.get('NODE_ENV'));

    // Se obtienen los datos de la orden de mantenimiento
    const ordenMantenimiento: any = await this.ordenesRepository.findOne({ 
      relations:{ obra_madera: true }, 
      where: { id }
    });
    
    const body = [];

    // const productos = [
    //   {
    //     id: 1,
    //     descripcion: 'MOUSE USB',
    //     precio: 1200,
    //     cantidad: 5
    //   },
    //   {
    //     id: 2,
    //     descripcion: 'TECLADO USB',
    //     precio: 2000,
    //     cantidad: 2
    //   },
    //   {
    //     id: 3,
    //     descripcion: 'MONITOR GAMING',
    //     precio: 8000,
    //     cantidad: 1
    //   },
    // ];

    // for (let producto of productos) {
    //   const rows = new Array();
    //   rows.push(producto.id);
    //   rows.push(producto.descripcion);
    //   rows.push(`$${producto.precio}`);
    //   rows.push(producto.cantidad);
    //   body.push(rows);
    // }

    // Generacion del PDF
    const pdfBuffer: Buffer = await new Promise(resolve => {

      var fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        },
      };

      // const columnsTitle: TableCell[] = [
      //   { text: "ID", style: 'columnsTitle' },
      //   { text: "Descripcion", style: 'columnsTitle' },
      //   { text: "Precio", style: 'columnsTitle' },
      //   { text: "Cantidad", style: 'columnsTitle' }
      // ];

      // const columnsBody = new Array();
      // columnsTitle.forEach(column => columnsBody.push(column));
      // body.push(columnsBody);

      const printer = new PdfPrinter(fonts);

      const docDefinitions: TDocumentDefinitions = {

        defaultStyle: { font: 'Helvetica' },

        content: [

          // Encabezado
          
          {

            columns: [
              { 
                image: this.configService.get('NODE_ENV') === 'production' ? `../assets/elirani.png` : './assets/elirani.png', 
                width: 150,
              },
              { 
                text: `Fecha: ${format(ordenMantenimiento.fecha, 'dd-MM-yyyy')}`, 
                style: 'fecha' 
              },
            ],

          },

          // Titulo - General
          
          { 
            text: 'ORDEN DE MANTENIMIENTO',
            style: 'titulo'
          },

          // Cuerpo
          
          { 
            text: [
            {text: 'Código de Obra: ', bold: true},`MA${ordenMantenimiento.obra_madera.codigo}`], 
            style: 'item' 
          },

          { 
            text: [
            {text: 'Nro de orden: ', bold: true},`${id}`], 
            style: 'item' 
          },

          { 
            text: [
            {text: 'Precio de mantenimiento: ', bold: true},`${ ordenMantenimiento.precio ? '$' + ordenMantenimiento.precio : 'Sin especificar' }`], 
            style: 'item' 
          },

          { 
            text: [
            {text: 'Observaciones: ', bold: true},`${ ordenMantenimiento.observaciones ? ordenMantenimiento.observaciones : 'Sin especificar' }`], 
            style: 'item' 
          },
          
          // Tabla de productos
          // {
          //   table: {
          //     headerRows: 1,
          //     widths: [100, 'auto', '*', '*'],
          //     heights: function (row) {
          //       if (row === 0) {
          //         return 25;
          //       }
          //     },
          //     body: [
          //       [
          //         { text: "ID", style: 'columnsTitle' },
          //         { text: "Descripcion", style: 'columnsTitle' },
          //         { text: "Precio", style: 'columnsTitle' },
          //         { text: "Cantidad", style: 'columnsTitle' }  
          //       ],
          //       ...body
          //     ],
          //   }
          // },
        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            marginBottom: 10,
            alignment: 'center',
          },
          columnsTitle: {
            fontSize: 10,
            bold: true,
            fillColor: '#E9ECFF',
            alignment: 'center'
          },
          titulo: {
            alignment: 'center',
            bold: true,
            marginTop: 40,
            marginBottom: 20
          },
          fecha: {
            alignment: 'right',
            marginTop: 23
          },
          item: {
            marginTop: 17
          }
        }

      };

      const pdfDoc = printer.createPdfKitDocument(docDefinitions);
      // pdfDoc.pipe(fs.createWriteStream("Example.pdf"));

      const chunks = [];

      pdfDoc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.end();

      pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result)
      })

    })

    return pdfBuffer;

  }

}
