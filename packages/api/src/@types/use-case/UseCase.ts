export default interface UseCase<TInput, TOutput> {
    execute(input: TInput): TOutput;
}
