export enum MultifactorExceptionMessages {
  ALREADY_VERIFIED = 'Este método multifactor ya está verificado.',
  NOT_VERIFIED = 'Este método multifactor no está verificado.',
  ALREADY_ACTIVE = 'Este método multifactor ya está activo.',
  NOT_ACTIVE = 'Este método multifactor no está activo.',
  NOT_INITIALIZED = 'No se ha solicitado inicializar el metodo multifactor.',
  EXPIRED_CODE = 'El codigo ha expirado, solicite uno nuevamente.',
  INVALID_CODE = 'Codigo de verificacion incorrecto.',
  CODE_IN_PROGRESS = 'Hay una verificacion en curso, revise su contacto activo.',
  ALREADY_AUTHENTICATED = 'Este metodo ya ha sido autenticado, ya puede iniciar sesion.',
}
