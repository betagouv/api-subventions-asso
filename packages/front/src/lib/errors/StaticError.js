export default class StaticError extends Error {
    constructor(data) {
        super(data.message);
        this.data = data;
    }

    static httpCode = 0;
}
