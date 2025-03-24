import { Module } from '@nestjs/common';
import { EndpointDiscoveryService } from '../providers/endpoints.provider';

@Module({
  imports: [EndpointDiscoveryService.register()],
})
export class EndpointsModule {}
