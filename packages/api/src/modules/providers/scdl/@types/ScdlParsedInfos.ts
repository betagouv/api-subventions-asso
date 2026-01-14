import { HeaderValidationResult } from "./HeaderValidationResult";

export interface ScdlParsedInfos {
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    headerValidationResult: HeaderValidationResult;
}
