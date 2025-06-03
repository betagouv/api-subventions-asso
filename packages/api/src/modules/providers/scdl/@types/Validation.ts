import { DefaultObject } from "../../../../@types";

export type StringBoolean = "oui" | "non";
export type Validity = { valid: true; problems?: FormatProblem[] } | { valid: false; problems: FormatProblem[] };
export type FormatProblem = { colonne: string; valeur: unknown; message: string };
export type ParsedErrorFormat = DefaultObject & FormatProblem & { bloquant: StringBoolean };
export type ParsedErrorDuplicate = DefaultObject & { doublon: "oui"; bloquant: "oui" };
export type MixedParsedError = DefaultObject & FormatProblem & { bloquant: StringBoolean; doublon: StringBoolean };
