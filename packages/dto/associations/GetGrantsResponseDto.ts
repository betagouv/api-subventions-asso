import { GrantFlatDto } from "../flat";
import { Grant } from "../grant/grant";

export interface GetOldGrantsSuccessResponseDto {
    subventions: Grant[];
    count: number;
}

export interface GetGrantsSuccessResponseDto {
    subventions: GrantFlatDto[];
    count: number;
}

export type GetOldGrantsResponseDto = GetOldGrantsSuccessResponseDto;
export type GetGrantsResponseDto = GetGrantsSuccessResponseDto;
