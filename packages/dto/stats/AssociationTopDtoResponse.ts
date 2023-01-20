import { ErrorResponse } from "../shared/ErrorResponse";

export type AssociationTop = { name: string; visits: number };

export interface AssociationTopDtoSuccessResponse {
    data: AssociationTop[];
}

export type AssociationTopDtoResponse = AssociationTopDtoSuccessResponse | ErrorResponse;
