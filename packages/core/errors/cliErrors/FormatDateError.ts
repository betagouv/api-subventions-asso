export class FormatDateError extends Error {
    constructor(format = "YYYY-MM-DD") {
        super(`You must provide a valid export date for this command | ${format} expected`);
    }
}
