import { DefaultObject } from "../../../../@types";

export type StringBoolean = "oui" | "non";
export type Validity = { valid: true; problems?: Problem[] } | { valid: false; problems: Problem[] };
export type Problem = { colonne: string; valeur: unknown; message: string };
export type ParsedFormatErrorType = Problem & { bloquant: StringBoolean };
export type ParsedDataWithProblem = DefaultObject & Problem & { bloquant: StringBoolean } & { doublon: "non" };
export type ParsedDataDuplicate = DefaultObject & { doublon: "oui" } & {
    colonne: "N/A";
    message: "N/A";
    valeur: "N/A";
    bloquant: "N/A";
};
