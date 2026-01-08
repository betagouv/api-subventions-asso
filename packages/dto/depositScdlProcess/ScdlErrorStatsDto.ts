import { MixedParsedErrorDto } from "./MixedParsedErrorDto";

export interface ScdlErrorStatsDto {
    count: number;
    errors: MixedParsedErrorDto[];
}
