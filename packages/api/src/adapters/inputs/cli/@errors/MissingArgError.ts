export class MissingArgError extends Error {
    constructor(argName) {
        super(`${argName} must be provided for the command to run`);
    }
}
