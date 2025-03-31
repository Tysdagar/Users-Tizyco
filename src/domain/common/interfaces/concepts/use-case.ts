export interface IUseCase<TRequest, TResult> {
  execute(request: TRequest): Promise<TResult>;
}
