import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Response as XRes, Request as XReq } from 'express';
import { BadRequestException } from '@nestjs/common';

export abstract class RequestResolver<TRequest = any, TResponse = any> {
  abstract execute(
    request: TRequest,
    ...args: any[]
  ): Promise<Response<TResponse> | void>;

  protected setCookie(
    res: XRes,
    cookieName: string,
    payload: string,
    cookieExpiresIn: number,
    path: string = '',
  ) {
    res.cookie(cookieName, payload, {
      httpOnly: true,
      secure: false,
      maxAge: cookieExpiresIn * 1000,
      path,
    });
  }

  protected getCookie<TCookie>(req: XReq, cookieName: string): TCookie {
    const cookieValue = req.cookies[cookieName] as TCookie;
    if (!cookieValue) {
      throw new BadRequestException(`La cookie ${cookieName} no existe.`);
    }
    return cookieValue;
  }

  protected deleteCookie(res: XRes, cookieName: string, path: string) {
    res.clearCookie(cookieName, { path });
  }

  protected ok(response: Response<TResponse>): Response<TResponse> {
    return response;
  }
}
