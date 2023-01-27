export default class StaticError extends Error {
    constructor(data) {
        super(data.message);
        this.data = data;
    }

    static get httpCode() {
        return 0;
    }
}
