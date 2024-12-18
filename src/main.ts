import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './shared/env.enum';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get(Env.Port);

    await app.listen(port);
}
bootstrap();
