import {SuccessResponse, ErrorResponse} from "../shared/ResponseStatus";
import { DemandeSubvention } from '../search/DemandeSubvention';

export interface GetDemandeSubventionSuccessResponse extends SuccessResponse {
    success: true,
    subvention?: DemandeSubvention,
    message?: string
}
export interface GetDemandeSubventionErrorResponse extends ErrorResponse {
    success: false,
    message: string
}

export type GetDemandeSubventionResponseDto = GetDemandeSubventionSuccessResponse | GetDemandeSubventionErrorResponse;