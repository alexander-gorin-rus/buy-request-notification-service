import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestInterface } from 'src/types';

@Injectable()
export abstract class GrpcRequestService implements GrpcRequestInterface {
  private readonly logger = new Logger();
  protected constructor(public readonly client: ClientGrpc) {}
  async getResponse<R, C, M>(
    client: C,
    grpcFunction: string,
    message: M,
  ): Promise<R> {
    this.logger.log(
      `<Grpc request ${grpcFunction}> ${JSON.stringify(message)}`,
    );
    const response: R = await firstValueFrom(
      client[grpcFunction](message).pipe(map((item: any) => ({ ...item }))),
    );
    this.logger.log(
      `<Grpc response ${grpcFunction}> ${JSON.stringify(response)}`,
    );
    return response;
  }
}
