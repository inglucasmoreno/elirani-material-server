import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ObrasMaderaPasesService } from './obras-madera-pases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObrasMaderaPases } from './entities';
import { ObrasMaderaPasesDTO } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Obras Madera - Pases')
@ApiBearerAuth('Authorization')
@Controller('obras-madera-pases')
export class ObrasMaderaPasesController {

  constructor(private readonly pasesService: ObrasMaderaPasesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async tipoPorId(@Res() res, @Param('id') id: number): Promise<ObrasMaderaPases> {

    const pase = await this.pasesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Pase obtenido correctamente',
      pase
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarPases(@Res() res, @Query() query): Promise<ObrasMaderaPases[]> {
    const { pases, totalItems } = await this.pasesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Pases obtenidos correctamente',
      pases,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearPase(@Res() res, @Body() pasesDTO: ObrasMaderaPasesDTO): Promise<ObrasMaderaPases> {

    const pase = await this.pasesService.insert(pasesDTO);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Pase creado correctamente',
      pase
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarPase(@Res() res, @Param('id') id: number, @Body() pasesUpdateDTO: any) {

    const pase = await this.pasesService.update(id, pasesUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Pase actualizado correctamente',
      pase
    })

  }

}
