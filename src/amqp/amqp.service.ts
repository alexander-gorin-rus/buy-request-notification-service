import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage, Options } from 'amqplib';
import { AmqpProvider } from './amqp.provider';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewRequestCreated } from '../modules/notification/interfaces/notification.interface';
import { RequestCreatedEvent } from '../common/events/request.created.event';
import { EVENTS } from '../common/events';

@Injectable()
export class AmqpService {
  private readonly logger = new Logger();
  constructor(
    private readonly amqpProvider: AmqpProvider,
    private amqpConnection: AmqpConnection,
    private eventEmitter: EventEmitter2,
  ) {}

  public async publish<D>(
    exchange: string,
    routingKey: string,
    type: string,
    message: D,
    options?: Options.Publish,
  ) {
    try {
      const { message: msg, buffer } = this.amqpProvider.encodeMessage<D>(
        type,
        message,
      );
      this.logger.log(
        `<AMQP Publish message to ${routingKey}> ${JSON.stringify(msg)}`,
      );
      await this.amqpConnection.publish(exchange, routingKey, buffer, options);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'test.event.test-service.committed',
    allowNonJsonMessages: true,
  })
  public async pubSubHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider.decodeMessage(
        'userService.TestEventUserServiceCommitted',
        amqpMsg.content,
      );
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'event.request-service.newRequest.created',
    allowNonJsonMessages: true,
  })
  public async pubSubNewRequestHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider
        .decodeMessage<INewRequestCreated>(
          'requestService.NewRequestCreated',
          amqpMsg.content,
        )
        .toJSON();
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
      this.eventEmitter.emit(
        EVENTS.NEW_REQUEST_CREATED,
        new RequestCreatedEvent(msg),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'event.notification-service.newUser.created',
    allowNonJsonMessages: true,
  })
  async pubSubNewUserHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider
        .decodeMessage('notificationService.NewUserCreated', amqpMsg.content)
        .toJSON();
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
      this.eventEmitter.emit(EVENTS.NEW_USER_CREATED, msg);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'event.notification-service.newNotification.created',
    allowNonJsonMessages: true,
  })
  async pubSubNewNotificationHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider
        .decodeMessage('notificationService.NewNotification', amqpMsg.content)
        .toJSON();
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
      this.eventEmitter.emit(EVENTS.NEW_NOTIFICATION, msg);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'event.notification-service.code.send',
    allowNonJsonMessages: true,
  })
  async pubSubNewCodeGeneratedHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider
        .decodeMessage('notificationService.NewCodeGenerated', amqpMsg.content)
        .toJSON();
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
      this.eventEmitter.emit(EVENTS.NEW_CODE_GENERATED, msg);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: 'event.notification-service.password-change.send',
    allowNonJsonMessages: true,
  })
  async pubPasswordChangeHandler(message: any, amqpMsg: ConsumeMessage) {
    try {
      const msg = this.amqpProvider
        .decodeMessage('notificationService.PasswordChange', amqpMsg.content)
        .toJSON();
      this.logger.log(
        `<AMQP Received message> ${JSON.stringify(msg)} - <CorrelationId - ${
          amqpMsg.properties.correlationId
        }>`,
      );
      this.eventEmitter.emit(EVENTS.PASSWORD_CHANGED, msg);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
