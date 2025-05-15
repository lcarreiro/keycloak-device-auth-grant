// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DeviceAuthService } from './cli/device-auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(DeviceAuthService);

  await authService.authenticateViaDeviceFlow();
  await app.close();
}
bootstrap();
