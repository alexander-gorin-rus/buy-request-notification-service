import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { CommonModule } from './common/common.module';
import { AmqpModule } from './amqp/amqp.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotificationModule } from './modules/notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './modules/email/email.module';

const { databaseDefaultConfig, applicationName, amqp, mailSetting } =
  configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...databaseDefaultConfig,
    }),
    EventEmitterModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(applicationName, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [amqp.exchanges.events],
      uri: `amqp://${amqp.username}:${amqp.password}@${amqp.hostname}:${amqp.port}`,
      connectionInitOptions: { wait: false },
    }),
    MailerModule.forRoot({
      transport: {
        host: mailSetting.host,
        port: mailSetting.port,
        ignoreTLS: mailSetting.ignoreTLS,
        secure: mailSetting.secure,
        auth: {
          user: mailSetting.user,
          pass: mailSetting.password,
        },
      },
      defaults: {
        from: mailSetting.from,
      },
      preview: true,
      template: {
        dir: mailSetting.templatePath,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AmqpModule,
    NotificationModule,
    CommonModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
