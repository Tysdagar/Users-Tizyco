export interface SessionData {
  sessionId: string;
  refreshToken: string;
  expiresIn: number;
  createdAt: Date;
  fingerPrint: string;
}

export interface AccessTokenData {
  accessToken: string;
  tokenType: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface FingerPrint {
  ip: string;
  userAgent: string;
  device: string;
}
