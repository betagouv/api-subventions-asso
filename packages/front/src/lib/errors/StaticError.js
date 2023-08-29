export default class StaticError extends Error {
    constructor(data, error) {
        super(data.message);
        this.data = data;
        this.__nativeError__ = error;
    }

    static httpCode = 0;
}
