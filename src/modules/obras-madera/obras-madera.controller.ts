import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObrasMaderaDTO } from './dto';
import { ObrasMadera } from './entities';
import { ObrasMaderaService } from './obras-madera.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Obras Madera')
@ApiBearerAuth('Authorization')
@Controller('obras-madera')
export class ObrasMaderaController {

  constructor(private readonly obrasService: ObrasMaderaService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async obraPorId(@Res() res, @Param('id') id: number): Promise<ObrasMadera> {

    const { obra } = await this.obrasService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra obtenidas correctamente',
      obra,
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarObras(@Res() res, @Query() query): Promise<ObrasMadera[]> {
    const { obras, totalItems } = await this.obrasService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obras obtenidos correctamente',
      obras,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearObra(@Res() res, @Body() obrasDTO: ObrasMaderaDTO): Promise<ObrasMadera> {

    const obra = await this.obrasService.insert(obrasDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Obra creada correctamente',
      obra
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarObra(@Res() res, @Param('id') id: number, @Body() obrasUpdateDTO: any) {

    const { obra } = await this.obrasService.update(id, obrasUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra actualizada correctamente',
      obra
    })

  } 
  
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async eliminarObra(@Res() res, @Param('id') id: number) {

    await this.obrasService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra eliminada correctamente',
    })

  } 

  @UseGuards(JwtAuthGuard)
  @Patch('/pase/adelante/:id')
  async paseAdelante(@Res() res, @Param('id') id: number) {

    const { obra } = await this.obrasService.paseAdelante(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra actualizada correctamente',
      obra
    })

  } 

  @UseGuards(JwtAuthGuard)
  @Patch('/pase/atras/:id')
  async paseAtras(@Res() res, @Param('id') id: number) {

    const { obra } = await this.obrasService.paseAtras(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra actualizada correctamente',
      obra
    })

  }

}
