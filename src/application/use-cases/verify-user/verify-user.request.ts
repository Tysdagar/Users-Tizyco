export class VerifyUserRequest {
  constructor(
    public readonly userId: string,
    public readonly verificationCode: string,
  ) {}
}
