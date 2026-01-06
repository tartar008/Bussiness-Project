import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { BigIntToStringInterceptor } from './bigint-to-string.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  // อนุญาตทุก origin
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Import API')
    .setDescription('Excel Import Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalInterceptors(new BigIntToStringInterceptor());


  await app.listen(8081);
}
bootstrap();
