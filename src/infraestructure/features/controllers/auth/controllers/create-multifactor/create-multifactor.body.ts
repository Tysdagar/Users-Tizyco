import { ApiProperty } from '@nestjs/swagger';

export class CreateMultifactorBody {
  @ApiProperty({
    description: 'Metodo de contacto del multifactor',
    example: 'SMS , EMAIL',
  })
  public readonly method: string;

  @ApiProperty({
    description: 'Contacto al que se le enviara el codigo multifactor.',
    example: '3158892345, example@yopmail.com',
  })
  public readonly contact: string;
}
