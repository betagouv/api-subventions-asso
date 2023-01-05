import { ErrorResponse } from "../shared/ResponseStatus";

export interface HttpErrorResponse extends ErrorResponse {
    message: string;
    code: number;
}
