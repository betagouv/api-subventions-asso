import { ApplicationFlatDto } from "../flat";

export interface GetApplicationsFlatSuccessResponseDto {
    applications: ApplicationFlatDto[];
}

export type GetApplicationsFlatResponseDto = GetApplicationsFlatSuccessResponseDto;
