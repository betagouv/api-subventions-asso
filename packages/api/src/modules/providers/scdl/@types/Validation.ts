import { DefaultObject } from "../../../../@types";

export type Validity = { valid: true; problems?: Problem[] } | { valid: false; problems: Problem[] };
export type Problem = { field: string; value: unknown; message: string };
export type ParsedDataWithProblem = Problem & DefaultObject & { lineRejected: "oui" | "non" | "" };
