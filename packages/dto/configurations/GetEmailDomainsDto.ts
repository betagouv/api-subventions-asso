import { SuccessResponse, ErrorResponse } from "../shared/ResponseStatus";

export interface GetEmailDomainsSuccessResponse extends SuccessResponse {
    domains: string[];
}

export type GetEmailDomainsDto = GetEmailDomainsSuccessResponse | ErrorResponse;
