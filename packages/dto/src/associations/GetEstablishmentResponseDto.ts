import { EstablishmentWithProviderValues } from "../establishments";

export interface GetEstablishmentSuccessResponseDto {
    etablissement: Omit<Omit<EstablishmentWithProviderValues, "demandes_subventions">, "versements">;
}

export interface SearchEstablishmentSuccessResponseDto {
    etablissement: EstablishmentWithProviderValues;
}

export type GetEstablishmentResponseDto = GetEstablishmentSuccessResponseDto | SearchEstablishmentSuccessResponseDto;
