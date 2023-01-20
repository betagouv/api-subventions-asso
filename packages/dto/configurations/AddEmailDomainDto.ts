import { ErrorResponse } from "../shared/ErrorResponse";

export interface AddEmailDomainSuccessResponse {
    domain: string;
}

export type AddEmailDomainDto = AddEmailDomainSuccessResponse | ErrorResponse;
