import { RequestContextService } from 'src/infraestructure/helpers/request-context.service';

export class DeviceInfoClient {
  public static get userAgent() {
    return RequestContextService.get<string>('userAgent');
  }

  public static get device() {
    return RequestContextService.get<string>('device');
  }

  public static get ip() {
    return RequestContextService.get<string>('ip');
  }
}
