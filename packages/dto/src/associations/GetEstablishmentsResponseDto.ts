import { Establishment } from "../establishments";

export interface GetEstablishmentsSuccessResponseDto {
    etablissements: Establishment[];
}

export type GetEstablishmentsResponseDto = GetEstablishmentsSuccessResponseDto;
