export interface MixedParsedErrorDto {
    [key: string]: unknown;
    colonne: string;
    valeur: unknown;
    message: string;
    bloquant: "oui" | "non";
    doublon: "oui" | "non";
}
