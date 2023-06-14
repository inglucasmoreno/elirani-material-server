import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './modules/auth/dto';

@ApiTags('Autenticacion')
@Controller()
export class AppController {

  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) { }

  // Login
  @ApiBody({ type: LoginDTO })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  // Profile + Renovacion de token
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req) {
    // Generacion de token
    const token = this.jwtService.sign(req.user);
    return {
      usuario: req.user,
      token: 'bearer ' + token
    };
  }

}
