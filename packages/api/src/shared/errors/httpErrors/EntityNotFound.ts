import HttpError from "./HttpError";

export type EntityNotFoundInterface = EntityNotFoundError

export class EntityNotFoundError extends HttpError {
    constructor(message = "Entity Not Found", code?: number) {
        super(message);
        this.code = code;
    }
    status = 422;
}
