import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from './interfaces/notification.interface';

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Index()
  @Column()
  readonly userId: string;

  @Column('text')
  readonly message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  readonly type: NotificationType;

  @Index()
  @Column()
  readonly subjectId: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isRead: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  readonly archive: boolean;

  @CreateDateColumn()
  readonly createdAt: string;

  @UpdateDateColumn()
  readonly updatedAt: string;
}
