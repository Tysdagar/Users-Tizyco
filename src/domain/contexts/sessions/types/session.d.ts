export interface SessionData {
  sessionId: string;
  refreshToken: string;
  expiresIn: number;
  createdAt: Date;
}

export interface AccessTokenData {
  accessToken: string;
  tokenType: string;
  refreshToken?: string;
}
