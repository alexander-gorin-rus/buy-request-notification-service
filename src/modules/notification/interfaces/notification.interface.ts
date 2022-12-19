export enum NotificationType {
  UNKNOWN_NOTIFICATION_TYPE = 'UNKNOWN_NOTIFICATION_TYPE',
  NEW_REQUEST_CREATED = 'NEW_REQUEST_CREATED',
  NEW_OFFER_CREATED = 'NEW_OFFER_CREATED',
  NEW_DEAL_CREATED = 'NEW_DEAL_CREATED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  DEAL_IN_PROGRESS = 'DEAL_IN_PROGRESS',
  DEAL_PAID = 'DEAL_PAID',
  DEAL_CANCELED = 'DEAL_CANCELED',
  DEAL_COMPLETED = 'DEAL_COMPLETED',
  DEAL_CUSTOMER_PAID = 'DEAL_CUSTOMER_PAID',
  DEAL_DISPUTE = 'DEAL_DISPUTE',
  OFFER_CANCELED = 'OFFER_CANCELED',
  OFFER_CONFIRMED = 'OFFER_CONFIRMED',
  OFFER_IN_PROGRESS = 'OFFER_IN_PROGRESS',
  OFFER_IS_HOLD = 'OFFER_IS_HOLD',
}

export interface INewNotification {
  userId: string;
  type: NotificationType;
  message: string;
  subjectId: string;
}

export interface INotification extends INewNotification {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  isRead: boolean;
  archive: boolean;
}

export interface ISort {
  orderBy: 'ASC' | 'DESC';
  orderName: string;
}

export interface IGetUserNotificationsByUserId {
  userId: string;
  isRead?: boolean;
  archive?: boolean;
  types?: NotificationType[];
  sort?: ISort[];
  page?: number;
  perPage?: number;
  periodTime?: number;
}

export interface ISetIsReadNotificationRequest {
  ids: string[];
}

export interface SetAllNotificationRequestByUserId {
  userId: string;
}

export interface INewRequestCreated {
  requestId: string;
  tags: string[];
  description: string;
  link: string;
}
