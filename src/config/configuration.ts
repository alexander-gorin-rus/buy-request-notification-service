import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormConfig from '../../ormconfig';

const mailSetting = {
  host: process.env.MAILER_SMTP_SERVER,
  port: process.env.MAILER_SMTP_PORT,
  user: process.env.MAILER_LOGIN,
  ignoreTLS: true,
  secure: false,
  password: process.env.MAILER_PASSWORD,
  from: process.env.MAILER_FROM_ADDRESS,
  templatePath: join(process.cwd(), 'src/modules/email/templates'),
};

const PACKAGE_NAMES = {
  USER_PACKAGE: {
    name: 'USER_PACKAGE',
    packageName: 'UserService',
    package: 'userService',
  },
  NOTIFICATION_PACKAGE: {
    name: 'NOTIFICATION_PACKAGE',
    packageName: 'NotificationService',
    package: 'notificationService',
  },
  DEAL_PACKAGE: {
    name: 'DEAL_PACKAGE',
    packageName: 'DealService',
    package: 'dealService',
  },
  REQUEST_PACKAGE: {
    name: 'REQUEST_PACKAGE',
    packageName: 'RequestService',
    package: 'requestService',
  },
  PRODUCT_PACKAGE: {
    name: 'PRODUCT_PACKAGE',
    packageName: 'ProductService',
    package: 'productService',
  },
  FEEDBACK_PACKAGE: {
    name: 'FEEDBACK_PACKAGE',
    packageName: 'FeedbackService',
    package: 'feedbackService',
  },
};

const getClients = (): any => [
  {
    name: PACKAGE_NAMES.USER_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.USER_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'dist/protos/user-service/user.proto'),
        join(process.cwd(), 'dist/protos/user-service/error.proto'),
      ],
      url: `${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.NOTIFICATION_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.NOTIFICATION_PACKAGE.package,
      protoPath: [
        join(
          process.cwd(),
          'dist/protos/notification-service/notification.proto',
        ),
        join(process.cwd(), 'dist/protos/notification-service/error.proto'),
      ],
      url: `${process.env.NOTIFICATION_SERVICE_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.DEAL_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.DEAL_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'dist/protos/deal-service/deal.proto'),
        join(process.cwd(), 'dist/protos/deal-service/error.proto'),
      ],
      url: `${process.env.DEAL_SERVICE_HOST}:${process.env.DEAL_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.REQUEST_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.REQUEST_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'dist/protos/request-service/request.proto'),
        join(process.cwd(), 'dist/protos/request-service/error.proto'),
      ],
      url: `${process.env.REQUEST_SERVICE_HOST}:${process.env.REQUEST_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.PRODUCT_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.PRODUCT_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'dist/protos/product-service/product.proto'),
        join(process.cwd(), 'dist/protos/product-service/error.proto'),
      ],
      url: `${process.env.PRODUCT_SERVICE_HOST}:${process.env.PRODUCT_SERVICE_PORT}`,
    },
  },
  {
    name: PACKAGE_NAMES.FEEDBACK_PACKAGE.name,
    transport: Transport.GRPC,
    options: {
      package: PACKAGE_NAMES.FEEDBACK_PACKAGE.package,
      protoPath: [
        join(process.cwd(), 'dist/protos/feedback-service/feedback.proto'),
        join(process.cwd(), 'dist/protos/feedback-service/error.proto'),
      ],
      url: `${process.env.FEEDBACK_SERVICE_HOST}:${process.env.FEEDBACK_SERVICE_PORT}`,
    },
  },
];

const getAMQPOptions = () => ({
  name: process.env.RABBITMQ_NAME,
  hostname: process.env.RABBITMQ_HOST,
  port: parseInt(process.env.RABBITMQ_PORT, 10),
  username: process.env.RABBITMQ_DEFAULT_USER,
  password: process.env.RABBITMQ_DEFAULT_PASS,
  exchanges: {
    events: {
      name: 'events',
      type: 'topic',
    },
  },
});

const databaseDefaultConfig = (): TypeOrmModuleOptions =>
  ({ ...ormConfig } as TypeOrmModuleOptions);
export default () => ({
  applicationName: `${process.env.APPLICATION_NAME} NOTIFICATION SERVICE`,
  url: `${process.env.NOTIFICATION_SERVICE_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}`,
  packageNames: PACKAGE_NAMES,
  clients: getClients(),
  databaseDefaultConfig: databaseDefaultConfig(),
  amqp: getAMQPOptions(),
  mailSetting,
});
