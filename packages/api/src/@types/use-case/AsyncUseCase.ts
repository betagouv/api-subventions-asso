import UseCase from "./UseCase";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface AsyncUseCase<TInput, TOutput> extends UseCase<TInput, Promise<TOutput>> {}
