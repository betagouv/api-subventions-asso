import ErreurReponse from "../shared/ErreurReponse";

export interface AddEmailDomainSuccessResponse {
    domain: string;
}

export type AddEmailDomainDto = AddEmailDomainSuccessResponse | ErreurReponse;
