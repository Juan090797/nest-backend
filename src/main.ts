import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remueve todo lo que no esta incluido en los DTOs
      forbidNonWhitelisted: true // retorna bad request si hay propiedades en el objeto no requeridas
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
