import { BeforeAdaptation, ParserInfo, ParserPath } from ".";

export type ParserScheme<T extends BeforeAdaptation = string> = ParserInfo<T> | ParserPath;
