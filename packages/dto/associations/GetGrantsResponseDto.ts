import { Grant } from "../grant/grant";

export interface GetGrantsSuccessResponseDto {
    subventions: Grant[];
    count: number;
}

export type GetGrantsResponseDto = GetGrantsSuccessResponseDto;
