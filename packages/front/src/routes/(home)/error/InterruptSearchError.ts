export default class InterruptSearchError extends Error {
    constructor() {
        super("Search was interrupted, because another search is running");
    }
}
