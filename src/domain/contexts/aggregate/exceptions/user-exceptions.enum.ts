export enum UserExceptionMessages {
  MULTIFACTOR_AUTH_INITIALIZED = 'Se ha iniciado la autenticacion multifactor, revise su metodo de contacto.',
  MULTIFACTOR_AUTH_REINITIALIZED = 'Se ha iniciado la autenticacion multifactor nuevamente porque el anterior expiro, revise su metodo de contacto.',
  USER_BLOCKED = 'El usuario por seguridad ha sido bloqueado.',
  USER_DELETED = 'El usuario no existe.',
  AT_LEAST_ONE_AUTH_PROPERTY_REQUIRED = 'Se requiere actualizar al menos el email o la contraseña.',
  INVALID_CREDENTIALS = 'Las credenciales proporcionadas son incorrectas',
  USER_ALREADY_VERIFIED = 'El usuario ya se encuentra verificado.',
  NO_MULTIFACTOR_CODE_TO_VALIDATE = 'No existe el codigo multifactor a validar.',
  VERIFICATION_USER_IN_PROGRESS = 'Ya se ha solicitado la verificacion del usuario, puede canjear el codigo de seguridad para completar la verificacion',
}
