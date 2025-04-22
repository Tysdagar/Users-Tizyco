export const AUTH_API_GROUP = 'auth';
export const AUTH_API_TAG = 'Authorization';

export const AUTH_ENDPOINT_PATHS = {
  REGISTER: '/register',
  LOGIN: '/login',
  REQUEST_VERIFICATION: '/request-verification',
  VERIFICATION: '/verification',
  REFRESH_SESSION: '/refresh-session',
  LOGOUT: '/logout',
  CREATE_MULTIFACTOR: 'create-multifactor',
} as const;

export const AUTH_COOKIE_CONFIG = {
  REFRESH_TOKEN: {
    NAME: 'refreshToken',
    PATH: `/${AUTH_API_GROUP}${AUTH_ENDPOINT_PATHS.REFRESH_SESSION}`,
  },
  SESSION_TOKEN: {
    NAME: 'sessionToken',
    PATH: '/',
  },
} as const;
