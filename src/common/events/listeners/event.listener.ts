import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from '../index';
import {
  INewNotification,
  INewRequestCreated,
} from '../../../modules/notification/interfaces/notification.interface';
import { UserGrpcService } from '../../services/user.grpc-service';
import { NotificationService } from '../../../modules/notification/notification.service';
import { EmailService } from '../../../modules/email/email.service';

@Injectable()
export class EventListener {
  constructor(
    private userGrpcService: UserGrpcService,
    private notificationService: NotificationService,
    private emailService: EmailService,
  ) {}

  @OnEvent(EVENTS.NEW_REQUEST_CREATED)
  async handleNewRequestCreatedEvent(payload: INewRequestCreated) {
    const { tags, requestId, description, link } = payload;
    const data = [];
    const { users: sellers } = await this.userGrpcService.getSellersByTags(
      tags,
    );
    if (!sellers) {
      return;
    }
    sellers.forEach((seller) => {
      const {
        id,
        setting: { emails },
      } = seller;
      data.push({
        userId: id,
        type: EVENTS.NEW_REQUEST_CREATED,
        subjectId: requestId,
        message: EVENTS.NEW_REQUEST_CREATED,
      });
      if (emails) {
        /*TODO ADD queues*/
        this.emailService.sendNewRequestCreatedMail({
          locale: seller.locale,
          to: seller.email,
          context: {
            name: seller.userName,
            link: link ?? 'https://buyrequest-prod.umbrellait.tech/dashboard',
            tags,
            description,
          },
        });
      }
    });
    await this.notificationService.createUsersNotifications(data);
  }

  @OnEvent(EVENTS.NEW_USER_CREATED)
  async handleNewUserCreatedEvent(payload: {
    authId: string;
    email: string;
    link: string;
  }) {
    const { email, link, authId } = payload;
    const user = await this.userGrpcService.getUserByClientAccountId(authId);

    await this.emailService.sendNewUserCreatedMail({
      locale: user.locale,
      to: email,
      context: {
        link,
      },
    });
  }

  @OnEvent(EVENTS.PASSWORD_CHANGED)
  async handlePasswordChanged(payload: { email: string; authId: string }) {
    const { email, authId } = payload;

    const user = await this.userGrpcService.getUserByClientAccountId(authId);
    await this.emailService.sendPasswordChange({
      locale: user.locale,
      to: email,
    });
  }

  @OnEvent(EVENTS.NEW_CODE_GENERATED)
  async handleNewCodeGeneratedEvent(payload: {
    authId: string;
    email: string;
    code: string;
  }) {
    const { email, code, authId } = payload;
    const user = await this.userGrpcService.getUserByClientAccountId(authId);

    await this.emailService.sendNewCodeMail({
      locale: user.locale,
      to: email,
      context: {
        code,
      },
    });
  }

  @OnEvent(EVENTS.NEW_NOTIFICATION)
  async handleNewOfferCreatedEvent(payload: INewNotification) {
    await this.notificationService.createUserNotification(payload);
  }
}
