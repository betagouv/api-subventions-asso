import ErreurReponse from "../shared/ErreurReponse";

export interface GetEmailDomainsSuccessResponse {
    domains: string[];
}

export type GetEmailDomainsDto = GetEmailDomainsSuccessResponse | ErreurReponse;
