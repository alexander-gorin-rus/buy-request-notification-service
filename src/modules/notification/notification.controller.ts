import { Controller, Injectable } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import {
  INewNotification,
  IGetUserNotificationsByUserId,
  INotification,
  ISetIsReadNotificationRequest,
} from './interfaces/notification.interface';
import { CommonIsSuccessResponse, GetDataResponseWithPage } from '../../types';
import { setAllUserIdDto } from './dto/setAllUserIdDto';

@Injectable()
@Controller()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @GrpcMethod('NotificationService')
  async getUserNotificationsByUserId(
    data: IGetUserNotificationsByUserId,
  ): Promise<GetDataResponseWithPage<INotification>> {
    return await this.notificationService.getUserNotificationsByUserId(data);
  }

  @GrpcMethod('NotificationService')
  async createUserNotification(
    data: INewNotification,
  ): Promise<CommonIsSuccessResponse> {
    return await this.notificationService.createUserNotification(data);
  }

  @GrpcMethod('NotificationService')
  async setNotificationIsRead(
    data: ISetIsReadNotificationRequest,
  ): Promise<CommonIsSuccessResponse> {
    return await this.notificationService.setNotificationIsRead(data);
  }

  @GrpcMethod('NotificationService')
  async setNotificationIsArchive(
    data: ISetIsReadNotificationRequest,
  ): Promise<CommonIsSuccessResponse> {
    return await this.notificationService.setNotificationIsArchive(data);
  }

  @GrpcMethod('NotificationService')
  async setAllNotificationIsArchive(
    @Payload() data: setAllUserIdDto,
  ): Promise<CommonIsSuccessResponse> {
    return await this.notificationService.setAllNotificationIsArchive(data);
  }

  @GrpcMethod('NotificationService')
  async setAllNotificationIsRead(
    @Payload() data: setAllUserIdDto,
  ): Promise<CommonIsSuccessResponse> {
    return await this.notificationService.setAllNotificationIsRead(data);
  }
}
