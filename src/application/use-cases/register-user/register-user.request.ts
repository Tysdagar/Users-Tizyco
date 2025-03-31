export class RegisterUserRequest {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly confirmatePassword: string,
  ) {}
}
