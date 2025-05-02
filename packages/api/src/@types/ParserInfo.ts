import { ParserPath } from "./ParserPath";
import { NestedDefaultObject } from "./utils";

export type BeforeAdaptation = string | number; // only string for csv, string or number for Excel

export interface ParserInfo<TypeIn extends BeforeAdaptation = string, TypeOut = unknown> {
    path: ParserPath;
    adapter?: (value: TypeIn | undefined) => TypeOut;
}

export type NestedBeforeAdaptation<T = string> = NestedDefaultObject<T>;
