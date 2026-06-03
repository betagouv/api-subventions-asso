export enum VALID_REQUEST_ERROR_CODE {
    INVALID_SIRET = 1,
    INVALID_OSIRISID = 2,
    INVALID_RNA = 3,
    NOT_AN_ASSOCIATION = 4,
    API_ASSO_UNAVAILABLE = 5,
}

export type OsirisRequestValidation = {
    message: string;
    data: unknown;
    code: VALID_REQUEST_ERROR_CODE;
};

export class InvalidOsirisRequestError extends Error {
    constructor(public validation: OsirisRequestValidation) {
        super();
    }
}
