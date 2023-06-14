import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import morgan from 'morgan';
import { CORS } from './constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // MORGAN - DEV
  app.use(morgan('dev'));

  // Accedemos a las variables de entorno
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors(CORS);

  // Validaciones
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    // forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  // app.setGlobalPrefix('api') // Para agregar un prefijo (Suele usarse para especificar versiones)

  // Documentacion - Swagger
  const config = new DocumentBuilder()
    .setTitle('EL Irani')
    .setDescription('Equinoccio Technology - Aplicación de gestión de obras')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header'}, 'Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      docExpansion: false,
      showRequestDuration: true
    }
  });

  // Inicio del servidor
  await app.listen(configService.get('PORT') || 3000);
  console.log(`Aplicacion corriendo en: ${await app.getUrl()}`);

}
bootstrap();
