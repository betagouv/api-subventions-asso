import { MixedParsedErrorDto } from "./MixedParsedErrorDto";

export interface ScdlErrorStatsDto {
    count: number;
    errorSample: MixedParsedErrorDto[];
}
