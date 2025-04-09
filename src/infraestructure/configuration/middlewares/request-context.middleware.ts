import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../../helpers/request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    RequestContextService.run(() => {
      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        'unknown';

      RequestContextService.set('ip', ip);
      RequestContextService.set('userAgent', req.headers['user-agent']);
      RequestContextService.set(
        'device',
        req.headers['sec-ch-ua-platform'] || 'Unknown',
      );
      RequestContextService.set('user', req['user'] || null);

      next();
    });
  }
}
