export class CreateMultifactorRequest {
  constructor(
    public readonly userId: string,
    public readonly method: string,
    public readonly contact: string,
  ) {}
}
