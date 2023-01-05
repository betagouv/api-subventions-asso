import { SuccessResponse, ErrorResponse } from "../shared/ResponseStatus";

export interface AddEmailDomainSuccessResponse extends SuccessResponse {
    domain: string;
}

export type AddEmailDomainDto = AddEmailDomainSuccessResponse | ErrorResponse;
