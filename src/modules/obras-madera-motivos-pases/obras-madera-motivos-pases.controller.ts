import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ObrasMaderaMotivosPasesService } from './obras-madera-motivos-pases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObrasMaderaMotivosPases } from './entities';
import { ObrasMaderaMotivosPasesDTO } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Obras Madera - Motivos de pases')
@ApiBearerAuth('Authorization')
@Controller('obras-madera-motivos-pases')
export class ObrasMaderaMotivosPasesController {

  constructor(private readonly motivosService: ObrasMaderaMotivosPasesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async motivoPorId(@Res() res, @Param('id') id: number): Promise<ObrasMaderaMotivosPases> {

    const motivo = await this.motivosService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Motivos obtenidos correctamente',
      motivo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarMotivos(@Res() res, @Query() query): Promise<ObrasMaderaMotivosPases[]> {
    const { motivos, totalItems } = await this.motivosService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Motivos obtenidos correctamente',
      motivos,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crearMotivo(@Res() res, @Body() motivosDTO: ObrasMaderaMotivosPasesDTO): Promise<ObrasMaderaMotivosPases> {

    const motivo = await this.motivosService.insert(motivosDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Motivo creado correctamente',
      motivo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarMotivo(@Res() res, @Param('id') id: number, @Body() motivosUpdateDTO: any) {

    const motivo = await this.motivosService.update(id, motivosUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Motivo actualizado correctamente',
      motivo
    })

  }



}
