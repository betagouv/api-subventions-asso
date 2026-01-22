import { UnprocessableEntityError } from "./UnprocessableEntityError";

export class PathParamError extends UnprocessableEntityError {
    constructor(message: string = "Invalid Path Param", cause: { value: string }) {
        super(message, cause);
    }
}
