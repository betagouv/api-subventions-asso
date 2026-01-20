import { MissingHeaders } from "./MissingHeaders";

export interface ScdlParsedInfos {
    allocatorsSiret: string[];
    grantCoverageYears: number[];
    parseableLines: number;
    totalLines: number;
    missingHeaders: MissingHeaders;
}
