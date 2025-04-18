export enum UserSessionsExceptionMessages {
  NOT_AUTHENTICATED = 'La sesion para este usuario es inválida o ha expirado, Inicie sesion nuevamente.',
  SESSION_CLOSED = 'La sesion ya ha terminado, Inicie sesion nuevamente.',
  INVALID_REFRESH_TOKEN = 'Solicitud de refresco de sesion no valida, Inicie sesion nuevamente.',
  BAD_BUILDED_SESSION = 'La sesion esta incompleta o corrupta, Inicie sesion nuevamente.',
}
