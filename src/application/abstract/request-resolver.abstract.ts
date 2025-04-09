import { Response } from 'src/domain/common/wrappers/response.wrapper';

export abstract class RequestResolver<TRequest = any, TResponse = any> {
  abstract execute(
    request: TRequest,
    ...args: any[]
  ): Promise<Response<TResponse> | void>;
}
