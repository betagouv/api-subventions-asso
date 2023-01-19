import { ErrorResponse } from "../shared/ErrorResponse";

export interface HttpErrorResponse extends ErrorResponse {
    message: string;
    code: number;
}
