import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextClient } from '../clients/request-context.client';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    RequestContextClient.run(() => {
      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        'unknown';

      RequestContextClient.set('ip', ip);
      RequestContextClient.set('userAgent', req.headers['user-agent']);
      RequestContextClient.set(
        'device',
        req.headers['sec-ch-ua-platform'] || 'Unknown',
      );
      RequestContextClient.set('user', req['user'] || null);

      next();
    });
  }
}
