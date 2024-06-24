import { ParserPath } from "./ParserPath";

export type BeforeAdaptation = string | number; // only string for csv, string or number for Excel

export interface ParserInfo<Tin extends BeforeAdaptation = string, Tout = any> {
    path: ParserPath;
    adapter?: (value: Tin | undefined) => Tout;
}
