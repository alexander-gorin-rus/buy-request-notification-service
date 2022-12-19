import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { UserGrpcService } from './services/user.grpc-service';
import configuration from '../config/configuration';
import { EventListener } from './events/listeners/event.listener';
import { NotificationModule } from '../modules/notification/notification.module';
import { EmailModule } from '../modules/email/email.module';
import { EmailService } from '../modules/email/email.service';

const { clients } = configuration();

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register(clients),
    NotificationModule,
    EmailModule,
  ],
  providers: [UserGrpcService, EventListener, EmailService],
  exports: [CommonModule, ClientsModule],
})
export class CommonModule {}
