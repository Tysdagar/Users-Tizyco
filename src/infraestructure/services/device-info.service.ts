import { IFingerPrintService } from 'src/domain/contexts/sessions/interfaces/device-info.interface';
import { FingerPrint } from 'src/domain/contexts/sessions/types/session';
import { DeviceInfoClient } from '../configuration/clients/device-info.client';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { DataTransformationService } from '../helpers/data-transform.service';

@Injectable()
export class FingerPrintService implements IFingerPrintService {
  constructor(
    private readonly dataTransformationService: DataTransformationService,
  ) {}

  public getHash(): string {
    const deviceInfo = this.getFingePrintFromContext();

    return createHash('sha256')
      .update(JSON.stringify(deviceInfo))
      .digest('hex');
  }

  public getEncrypted(): string {
    const deviceInfo = this.getFingePrintFromContext();

    return this.dataTransformationService.transformToSecureFormat(deviceInfo);
  }

  private getFingePrintFromContext(): FingerPrint {
    return {
      ip: DeviceInfoClient.ip,
      device: DeviceInfoClient.device,
      userAgent: DeviceInfoClient.userAgent,
    };
  }
}
