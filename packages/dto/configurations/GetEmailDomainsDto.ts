import { ErrorResponse } from "../shared/ErrorResponse";

export interface GetEmailDomainsSuccessResponse {
    domains: string[];
}

export type GetEmailDomainsDto = GetEmailDomainsSuccessResponse | ErrorResponse;
