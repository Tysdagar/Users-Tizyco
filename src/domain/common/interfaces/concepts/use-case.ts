export interface IUseCase<TRequest, TResult> {
  handle(request: TRequest): Promise<TResult>;
}
