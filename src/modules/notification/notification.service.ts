import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import {
  INewNotification,
  IGetUserNotificationsByUserId,
  INotification,
  ISetIsReadNotificationRequest,
  SetAllNotificationRequestByUserId,
} from './interfaces/notification.interface';
import { CommonService } from '../../common/common.service';
import Notification from './notification.entity';
import { CommonIsSuccessResponse, GetDataResponseWithPage } from '../../types';
import { format } from 'date-fns';

@Injectable()
export class NotificationService extends CommonService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    super(notificationRepository);
  }

  async getUserNotificationsByUserId(
    data: IGetUserNotificationsByUserId,
  ): Promise<GetDataResponseWithPage<INotification>> {
    try {
      const {
        userId,
        isRead,
        page,
        perPage,
        sort,
        types,
        periodTime,
        archive,
      } = data;
      const skip = perPage ? perPage * (page - 1) : 1;
      const date = new Date();
      const daysAgo = new Date(date.getTime());
      const lessDate = daysAgo.setDate(date.getDate() - periodTime);
      const [notifications, totalCount] =
        await this.findAndCountByCriteria<INotification>({
          where: {
            userId,
            ...(isRead !== undefined ? { isRead } : {}),
            ...(archive !== undefined ? { archive } : {}),
            type: In(types),
            ...(periodTime
              ? {
                  createdAt: MoreThanOrEqual(
                    format(lessDate, 'yyyy-MM-dd kk:mm:ss.SSS'),
                  ),
                }
              : {}),
          },
          order: {
            ...(sort
              ? Object.assign(
                  {},
                  ...sort.map((sortArray) => {
                    return { [sortArray.orderName]: sortArray.orderBy };
                  }),
                )
              : {}),
          },
          ...(page ? { skip } : {}),
          ...(perPage ? { take: perPage } : {}),
        });
      return {
        data: notifications,
        pageInfo: {
          page,
          perPage,
          totalCount,
          totalPageCount: Math.ceil(totalCount / (perPage ? perPage : 1)),
        },
      };
    } catch (error) {
      return {
        data: [],
        error,
        pageInfo: {
          page: 0,
          perPage: 0,
          totalCount: 0,
          totalPageCount: 0,
        },
      };
    }
  }

  async createUserNotification(
    data: INewNotification,
  ): Promise<CommonIsSuccessResponse> {
    const { userId, subjectId, message, type } = data;

    try {
      await this.serviceRepo.save({
        userId,
        subjectId,
        message,
        type,
      });
    } catch (error) {
      return {
        error,
        isSuccess: false,
      };
    }
    return {
      isSuccess: true,
    };
  }

  async createUsersNotifications(
    data: INewNotification[],
  ): Promise<CommonIsSuccessResponse> {
    try {
      await this.serviceRepo.save(data);
    } catch (error) {
      return {
        error,
        isSuccess: false,
      };
    }
    return {
      isSuccess: true,
    };
  }

  async setNotificationIsRead(
    data: ISetIsReadNotificationRequest,
  ): Promise<CommonIsSuccessResponse> {
    const { ids } = data;

    try {
      await this.serviceRepo
        .createQueryBuilder()
        .update(Notification)
        .set({
          isRead: true,
        })
        .where({ id: In(ids) })
        .execute();
    } catch (error) {
      return {
        error,
        isSuccess: false,
      };
    }
    return {
      isSuccess: true,
    };
  }

  async setAllNotificationIsRead(
    data: SetAllNotificationRequestByUserId,
  ): Promise<CommonIsSuccessResponse> {
    const { userId } = data;

    try {
      await this.serviceRepo
        .createQueryBuilder()
        .update(Notification)
        .set({
          isRead: true,
        })
        .where({ userId })
        .execute();
    } catch (error) {
      return {
        error,
        isSuccess: false,
      };
    }
    return {
      isSuccess: true,
    };
  }

  async setAllNotificationIsArchive(
    data: SetAllNotificationRequestByUserId,
  ): Promise<CommonIsSuccessResponse> {
    const { userId } = data;

    try {
      await this.serviceRepo
        .createQueryBuilder()
        .update(Notification)
        .set({
          archive: true,
        })
        .where({ userId })
        .execute();
    } catch (error) {
      return {
        error,
        isSuccess: false,
      };
    }
    return {
      isSuccess: true,
    };
  }

  async setNotificationIsArchive(
    data: ISetIsReadNotificationRequest,
  ): Promise<CommonIsSuccessResponse> {
    const { ids } = data;

    try {
      for (const id of ids) {
        await this.serviceRepo.save({ id, archive: true });
      }
    } catch (error) {
      return {
        error,
        isSuccess: false,
      };
    }
    return {
      isSuccess: true,
    };
  }
}
