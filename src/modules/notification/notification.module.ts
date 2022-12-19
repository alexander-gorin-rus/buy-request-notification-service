import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Notification from './notification.entity';
import { NotificationService } from './notification.service';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';

const { clients } = configuration();

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    ClientsModule.register(clients),
  ],
  controllers: [NotificationController],
  providers: [NotificationController, NotificationService],
  exports: [TypeOrmModule, NotificationService],
})
export class NotificationModule {}
