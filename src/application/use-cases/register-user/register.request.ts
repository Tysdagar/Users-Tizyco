export class RegisterUserRequest {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}
