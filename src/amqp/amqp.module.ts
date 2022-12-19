import { Module } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { ConfigModule } from '@nestjs/config';
import { AmqpProvider } from './amqp.provider';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [ConfigModule, AmqpConnection],
  providers: [AmqpService, AmqpProvider, AmqpConnection],
  controllers: [],
})
export class AmqpModule {}
