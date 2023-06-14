import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConstants } from './modules/auth/constants';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { InicializacionModule } from './modules/inicializacion/inicializacion.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { TiposPlacasMaderaModule } from './modules/tipos-placas-madera/tipos-placas-madera.module';
import { TiposMueblesModule } from './modules/tipos-muebles/tipos-muebles.module';
import { ObrasMaderaModule } from './modules/obras-madera/obras-madera.module';
import { MueblesModule } from './modules/muebles/muebles.module';
import { MueblesPlacasModule } from './modules/muebles-placas/muebles-placas.module';
import { ObrasMaderaMotivosPasesModule } from './modules/obras-madera-motivos-pases/obras-madera-motivos-pases.module';
import { ObrasMaderaPasesModule } from './modules/obras-madera-pases/obras-madera-pases.module';
import { UsuariosPermisosModule } from './modules/usuarios-permisos/usuarios-permisos.module';
import { OrdenesMantenimientoMaderaModule } from './modules/ordenes-mantenimiento-madera/ordenes-mantenimiento-madera.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './database/data.source';

@Module({
  imports: [

    // Directorio publico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    // Variables de entorno
    ConfigModule.forRoot({ 
      // envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true 
    }),

    // Autenticacion -> JsonWebToken
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' }
    }),

    // Conexion a base de datos
    // DatabaseModule,
    TypeOrmModule.forRoot({...DataSourceConfig}),
    
    // Custom modules
    AuthModule,
    UsuariosModule,
    InicializacionModule,
    ClientesModule,
    TiposPlacasMaderaModule,
    TiposMueblesModule,
    ObrasMaderaModule,
    MueblesModule,
    MueblesPlacasModule,
    ObrasMaderaMotivosPasesModule,
    ObrasMaderaPasesModule,
    UsuariosPermisosModule,
    OrdenesMantenimientoMaderaModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService){
    AppModule.port = +this.configService.get('PORT');
  }
}
