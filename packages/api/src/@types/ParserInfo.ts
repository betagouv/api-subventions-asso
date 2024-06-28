import { ParserPath } from "./ParserPath";
import { NestedDefaultObject } from "./utils";

export type BeforeAdaptation = unknown; //string | number; // only string for csv, string or number for Excel

export interface ParserInfo<Tin extends BeforeAdaptation = string, Tout = any> {
    path: ParserPath;
    adapter?: (value: Tin | undefined) => Tout;
}

export type NestedBeforeAdaptation<T = string> = NestedDefaultObject<T>;
