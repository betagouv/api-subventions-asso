import { ErrorResponse, SuccessResponse } from "../shared/ResponseStatus";

export type AssociationTop = { name: string; visits: number };

export interface AssociationTopDtoSuccessResponse extends SuccessResponse {
    data: AssociationTop[];
}

export type AssociationTopDtoResponse = AssociationTopDtoSuccessResponse | ErrorResponse;
