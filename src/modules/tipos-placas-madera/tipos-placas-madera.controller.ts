import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TiposPlacasMaderaDTO } from './dto';
import { TiposPlacasMadera } from './entities';
import { TiposPlacasMaderaService } from './tipos-placas-madera.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Obras Madera - Tipos de placa')
@ApiBearerAuth('Authorization')
@Controller('tipos-placas-madera')
export class TiposPlacasMaderaController {

  constructor(private readonly tiposService: TiposPlacasMaderaService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async tipoPorId(@Res() res, @Param('id') id: number): Promise<TiposPlacasMadera> {

    const tipo = await this.tiposService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Tipo de placa obtenido correctamente',
      tipo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarTipos(@Res() res, @Query() query): Promise<TiposPlacasMadera[]> {
    const { tipos, totalItems } = await this.tiposService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Tipos obtenidos correctamente',
      tipos,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearTipo(@Res() res, @Body() tiposDTO: TiposPlacasMaderaDTO): Promise<TiposPlacasMadera> {

    const tipo = await this.tiposService.insert(tiposDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Tipo creado correctamente',
      tipo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarTipo(@Res() res, @Param('id') id: number, @Body() tiposUpdateDTO: any) {

    const tipo = await this.tiposService.update(id, tiposUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Tipo actualizado correctamente',
      tipo
    })

  }

}
