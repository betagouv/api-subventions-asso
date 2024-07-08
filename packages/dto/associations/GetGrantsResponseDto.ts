import { Grant } from "../grant/grant";

export interface GetGrantsSuccessResponseDto {
    subventions: Grant[];
}

export type GetGrantsResponseDto = GetGrantsSuccessResponseDto;
