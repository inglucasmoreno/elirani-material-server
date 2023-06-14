import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientesService } from './clientes.service';
import { ClientesDTO } from './dto';
import { Clientes } from './entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth('Authorization')
@Controller('clientes')
export class ClientesController {

  constructor(private readonly clientesService: ClientesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async clientePorId(@Res() res, @Param('id') id: number): Promise<Clientes> {

    const cliente = await this.clientesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cliente obtenido correctamente',
      cliente
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/identificacion/:identificacion')
  async clientePorIdentificacion(@Res() res, @Param('identificacion') identificacion: string): Promise<Clientes> {

    const cliente = await this.clientesService.getPorIdentificacion(identificacion);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cliente obtenido correctamente',
      cliente
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarClientes(@Res() res, @Query() query): Promise<Clientes[]> {
    const {clientes, totalItems} = await this.clientesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Clientes obtenidos correctamente',
      clientes,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async nuevoCliente(@Res() res, @Body() clientesDTO: ClientesDTO): Promise<Clientes> {

    const cliente = await this.clientesService.insert(clientesDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Cliente creado correctamente',
      cliente
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarCliente(@Res() res, @Param('id') id: number, @Body() clientesUpdateDTO: any) {

    const cliente = await this.clientesService.update(id, clientesUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cliente actualizado correctamente',
      cliente
    })

  }

}
