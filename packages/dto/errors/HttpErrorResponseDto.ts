import ErreurReponse from "../shared/ErreurReponse";

export interface HttpErrorResponse extends ErreurReponse {
    message: string;
    code: number;
}
