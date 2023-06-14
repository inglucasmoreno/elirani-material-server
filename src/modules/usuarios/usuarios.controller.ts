import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { CambioPasswordDTO, UsuariosDTO, UsuariosUpdateDTO } from './dto';
import { Usuarios } from './entities';
import { UsuariosService } from './usuarios.service';
import * as bcryptjs from 'bcryptjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {

  constructor(private readonly usuariosService: UsuariosService){}

  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUsuario(@Res() res, @Param('id') id: number): Promise<Usuarios> {

    const usuario = await this.usuariosService.getUsuario(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Usuario obtenido correctamente',
      usuario      
    })

  }

  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get()
  async listarUsuarios(@Res() res, @Query() query): Promise<Usuarios[]> {
    const usuarios = await this.usuariosService.listarUsuarios(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      usuarios     
    })

  }

  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUsuario(@Res() res, @Body() usuariosDTO: UsuariosDTO): Promise<Usuarios> {

    const { password } = usuariosDTO;

    // Encriptado de password
    const salt = bcryptjs.genSaltSync();
    usuariosDTO.password = bcryptjs.hashSync(password, salt);

    const usuario = await this.usuariosService.crearUsuario(usuariosDTO);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Usuario creado correctamente',
      usuario
    })
  
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async actualizarUsuario(@Res() res, @Param('id') id: number, @Body() usuarioUpdateDTO: any){

    const { password } = usuarioUpdateDTO;

    // Se encripta el password en caso de que se tenga que actualizar
    if(password){
      const salt = bcryptjs.genSaltSync();
      usuarioUpdateDTO.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await this.usuariosService.actualizarUsuario(id, usuarioUpdateDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      usuario
    })

  }

  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Patch('/password/:id')
  async actualizarPassword(@Res() res, @Param('id') id: number, @Body() cambioPasswordDTO: CambioPasswordDTO){

    await this.usuariosService.actualizarPasswordPerfil(id, cambioPasswordDTO);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Password actualizado correctamente',
    })

  }

}
