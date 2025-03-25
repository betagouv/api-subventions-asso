// 2018 is/was the last year we want to store data from
export class ObsoleteDateError extends Error {
    constructor() {
        super(`You must provide a date with a year great than 2018`);
    }
}
