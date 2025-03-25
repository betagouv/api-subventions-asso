export class OutOfRangeDateError extends Error {
    constructor() {
        super(`You must provide a date lower or equal to the date of the day`);
    }
}
