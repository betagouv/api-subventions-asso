import { Establishment } from "../establishments";

export interface GetEstablishmentSuccessResponseDto {
    etablissement: Omit<Omit<Establishment, "demandes_subventions">, "versements">;
}

export interface SearchEstablishmentSuccessResponseDto {
    etablissement: Establishment;
}

export type GetEstablishmentResponseDto = GetEstablishmentSuccessResponseDto | SearchEstablishmentSuccessResponseDto;
