import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { InicializacionService } from './inicializacion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Inicializacion')
@ApiBearerAuth('Authorization')
@Controller('inicializacion')
export class InicializacionController {

    constructor(private inicializacionService: InicializacionService){}

    // Inicializacion de usuarios
    @Get()
    async initSistema(@Res() res){
        await this.inicializacionService.inicializacion();
        res.status(HttpStatus.OK).json({
            message: 'Inicializacion completado correctamente'
        })
    }


}
