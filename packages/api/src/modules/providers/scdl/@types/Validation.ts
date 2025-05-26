import { DefaultObject } from "../../../../@types";

export type StringBoolean = "oui" | "non";
export type Validity = { valid: true; problems?: Problem[] } | { valid: false; problems: Problem[] };
export type Problem = { field: string; value: unknown; message: string };
export type ParsedFormatErrorType = Problem & { lineRejected: StringBoolean };
export type ParsedDataWithProblem = DefaultObject & Problem & { lineRejected: StringBoolean } & { duplicate: false };
export type ParsedDataDuplicate = DefaultObject & { duplicate: StringBoolean } & {
    field: "N/A";
    message: "N/A";
    value: "N/A";
    lineRejected: "N/A";
};
