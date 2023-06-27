import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MueblesDTO } from './dto';
import { Muebles } from './entities';
import { MueblesService } from './muebles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Muebles')
@ApiBearerAuth('Authorization')
@Controller('muebles')
export class MueblesController {

  constructor(private readonly mueblesService: MueblesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async mueblePorId(@Res() res, @Param('id') id: number): Promise<Muebles> {

    const mueble = await this.mueblesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Mueble obtenido correctamente',
      mueble
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarMuebles(@Res() res, @Query() query): Promise<Muebles[]> {
    const { muebles, totalItems } = await this.mueblesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Muebles obtenidos correctamente',
      muebles,
      totalItems
    })
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearMueble(@Res() res, @Body() mueblesDTO: MueblesDTO): Promise<Muebles> {

    console.log(mueblesDTO);

    const { mueble, precio_obra } = await this.mueblesService.insert(mueblesDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Mueble creado correctamente',
      mueble,
      precio_obra
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarMueble(@Res() res, @Param('id') id: number, @Body() mueblesUpdateDTO: any) {

    const { mueble, precio_obra } = await this.mueblesService.update(id, mueblesUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Mueble actualizado correctamente',
      mueble,
      precio_obra
    })

  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async eliminarMueble(@Res() res, @Param('id') id: number) {

    const { precio_obra } = await this.mueblesService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Mueble eliminado correctamente',
      precio_obra
    })

  }

}
