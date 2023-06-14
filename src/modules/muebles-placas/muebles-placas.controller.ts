import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { MueblesPlacasService } from './muebles-placas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MueblesPlacas } from './entities';
import { MueblesPlacasDTO } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Muebles - Placas')
@ApiBearerAuth('Authorization')
@Controller('muebles-placas')
export class MueblesPlacasController {

  constructor(private readonly relacionesService: MueblesPlacasService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async relacionPorId(@Res() res, @Param('id') id: number): Promise<MueblesPlacas> {

    const relacion = await this.relacionesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relacion obtenida correctamente',
      relacion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarRelaciones(@Res() res, @Query() query): Promise<MueblesPlacas[]> {
    const { relacion, totalItems } = await this.relacionesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relaciones obtenidas correctamente',
      relacion,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearRelacion(@Res() res, @Body() relacionesDTO: MueblesPlacasDTO): Promise<MueblesPlacas> {

    const relacion = await this.relacionesService.insert(relacionesDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Relacion creada correctamente',
      relacion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarRelacion(@Res() res, @Param('id') id: number, @Body() relacionesUpdateDTO: any) {

    const { relacion } = await this.relacionesService.update(id, relacionesUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relacion actualizada correctamente',
      relacion
    })

  } 
  
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async eliminarRelacion(@Res() res, @Param('id') id: number) {

    await this.relacionesService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relacion eliminada correctamente',
    })

  } 

}
