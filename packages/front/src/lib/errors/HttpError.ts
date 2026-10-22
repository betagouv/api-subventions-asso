export default class HttpError extends Error {
    data: Record<string, unknown>;
    __nativeError__: Error;

    constructor(data: { message: string }, error: Error) {
        super(data.message);
        this.data = data;
        this.__nativeError__ = error;
    }
}
