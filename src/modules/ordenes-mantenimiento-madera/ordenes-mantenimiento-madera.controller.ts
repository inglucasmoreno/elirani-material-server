import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { OrdenesMantenimientoMaderaService } from './ordenes-mantenimiento-madera.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdenesMantenimientoMadera } from './entities';
import { OrdenesMantenimientoMaderaDTO } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Obras Madera - Ordenes de mantenimiento')
@ApiBearerAuth('Authorization')
@Controller('ordenes-mantenimiento-madera')
export class OrdenesMantenimientoMaderaController {

  constructor(private readonly ordenesService: OrdenesMantenimientoMaderaService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async ordenPorId(@Res() res, @Param('id') id: number): Promise<OrdenesMantenimientoMadera> {

    const orden = await this.ordenesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Orden de mantenimiento obtenida correctamente',
      orden
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarOrdenes(@Res() res, @Query() query): Promise<OrdenesMantenimientoMadera[]> {
    const { ordenes, totalItems } = await this.ordenesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Ordenes obtenidas correctamente',
      ordenes,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearOrden(@Res() res, @Body() ordenesDTO: OrdenesMantenimientoMaderaDTO): Promise<OrdenesMantenimientoMadera> {

    const orden = await this.ordenesService.insert(ordenesDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Orden creada correctamente',
      orden
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarOrden(@Res() res, @Param('id') id: number, @Body() ordenesUpdateDTO: any) {

    const orden = await this.ordenesService.update(id, ordenesUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Orden actualizada correctamente',
      orden
    })

  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async eliminarOrden(@Res() res, @Param('id') id: number) {

    await this.ordenesService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Orden eliminada correctamente',
    })

  }  

  // @UseGuards(JwtAuthGuard)
  @Get('/imprimir/:id')
  async imprimirOrden(@Res() res, @Param('id') id: number): Promise<void> {

    const buffer = await this.ordenesService.imprimir(id);

    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename-example.pdf',
    //   'Content-Length': buffer.length
    // })

    res.end(buffer);

  }


}
