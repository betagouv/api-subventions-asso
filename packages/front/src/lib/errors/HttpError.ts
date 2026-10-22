export default abstract class HttpError extends Error {
    abstract httpCode: number;

    data: Record<string, unknown>;
    __nativeError__: Error;

    constructor(data: { message: string }, error: Error) {
        super(data.message);
        this.data = data;
        this.__nativeError__ = error;
    }
}
