import { ParserPath } from "./ParserPath";

export interface ParserInfo {
    path: ParserPath;
    adapter?: (value: string | undefined) => unknown;
}
