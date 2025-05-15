import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceAuthService } from './cli/device-auth.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DeviceAuthService],
})
export class AppModule {}
