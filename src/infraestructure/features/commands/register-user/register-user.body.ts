import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserBody {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  public readonly email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'P@ssw0rd123',
  })
  public readonly password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña del usuario',
    example: 'P@ssw0rd123',
  })
  public readonly confirmatePassword: string;
}
