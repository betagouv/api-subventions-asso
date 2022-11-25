export default class InteruptSearchError extends Error {
    constructor() {
        super("Search as interupted, beacause an other search as run");
    }
}
