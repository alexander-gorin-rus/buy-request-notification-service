import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldSkip = isRabbitContext(context);
    if (shouldSkip) {
      return next.handle();
    }
    const ctx = context.switchToRpc();
    this.logger.log(
      `<Grpc request ${context.getHandler().name}> ${JSON.stringify(
        ctx.getData(),
      )}`,
    );
    return next.handle().pipe(
      tap((value) => {
        return this.logger.log(
          `<Grpc response ${context.getHandler().name}> ${JSON.stringify(
            value,
          )}`,
        );
      }),
    );
  }
}
