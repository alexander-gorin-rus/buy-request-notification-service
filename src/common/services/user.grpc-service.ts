import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { GrpcRequestService } from './grpc.request.service';
import { ClientGrpc } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import {
  IGetUserByClientAccountIdResponse,
  IUser,
  IGetUsersResponse,
  ISeller,
  IUserServiceClient,
} from '../../types';

const {
  packageNames: { USER_PACKAGE },
} = configuration();

@Injectable()
export class UserGrpcService
  extends GrpcRequestService
  implements OnModuleInit
{
  private userService: IUserServiceClient;

  constructor(
    @Inject(USER_PACKAGE.name) private userClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(userClient);
  }

  onModuleInit() {
    this.userService = this.userClient.getService<IUserServiceClient>(
      this.configService.get('packageNames').USER_PACKAGE.packageName,
    );
  }

  async getSellersByTags(
    tags: string[],
  ): Promise<IGetUsersResponse<ISeller[]>> {
    return this.getResponse<
      IGetUsersResponse<ISeller[]>,
      IUserServiceClient,
      { tags: string[] }
    >(this.userService, 'getSellersByTags', { tags });
  }

  async getUserByClientAccountId(clientAccountId: string): Promise<IUser> {
    const { user } = await this.getResponse<
      IGetUserByClientAccountIdResponse<IUser>,
      IUserServiceClient,
      { clientAccountId: string }
    >(this.userService, 'getUserByClientAccountId', {
      clientAccountId,
    });
    return user;
  }
}
