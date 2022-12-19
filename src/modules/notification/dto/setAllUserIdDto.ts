import { IsNotEmpty, IsString } from 'class-validator';
import { SetAllNotificationRequestByUserId } from '../interfaces/notification.interface';

export class setAllUserIdDto implements SetAllNotificationRequestByUserId {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
