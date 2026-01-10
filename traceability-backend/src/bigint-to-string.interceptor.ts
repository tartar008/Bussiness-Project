import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class BigIntToStringInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) =>
                JSON.parse(
                    JSON.stringify(data, (_, value) =>
                        typeof value === 'bigint' ? value.toString() : value,
                    ),
                ),
            ),
        );
    }
}
