import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Active CORS
    app.enableCors({
      origin: '*', // Frontend autorisé
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
      credentials: true, // Autorise les cookies ou les sessions
    });
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Regions, Départements et Communes API')
    .setDescription('API pour gérer les régions, départements et communes en France')
    .setVersion('1.0')
    .addTag('regions')
    .addTag('departements')
    .addTag('communes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // Swagger UI accessible à l'URL /api

  await app.listen(3000);
}

bootstrap();
