import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserBody {
  @ApiProperty({
    description: 'Id del usuario',
    example: 'e8b5f1c4-9a3d-4f7a-b1e0-3c6d52f8f7e5',
  })
  public readonly userId: string;

  @ApiProperty({
    description: 'Codigo de verificacion para el usuario',
    example: 'EBY769DTZSH',
  })
  public readonly verificationCode: string;
}
