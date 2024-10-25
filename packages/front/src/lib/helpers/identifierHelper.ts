import { RnaDto, SirenDto } from "dto";
import { removeWhiteSpace } from "./stringHelper";

export function isSiret(siret) {
    if (!siret) return false;
    return /^\d{14}/.test(removeWhiteSpace(siret));
}

export function isStartOfSiret(siret) {
    return typeof siret === "string" && /^\d{9,14}/.test(siret);
}

export function isSiren(siren) {
    if (!siren) return false;
    return /^\d{9}$/.test(removeWhiteSpace(siren));
}

export function isRna(rna) {
    if (!rna) return false;
    return /^W\d[A-Z\d]\d{7}$/.test(removeWhiteSpace(rna));
}

export function isIdentifier(identifier) {
    return isRna(identifier) || isSiren(identifier) || isSiret(identifier);
}

export function getUniqueIdentifier(identifiers: { rna?: RnaDto | null; siren?: SirenDto | null }[]): string {
    /**
     * Here we are trying to find the unique identifier in the case of a multiple rna or a multiple siren.
     *
     * For example, in the case of a duplicate rna (2 Rna for a Siret) we are looking to recover the rna that will allow us
     * to be sure that we are addressing the correct structure.
     */
    const { unique } = identifiers.reduce(
        (acc, identiferRnaSiren) => {
            if (Object.values(identiferRnaSiren).find(value => value && acc.multiple.has(value))) {
                return acc;
            }

            for (const identifierName in identiferRnaSiren) {
                // Separate identifier used

                if (acc.unique.has(identiferRnaSiren[identifierName])) {
                    acc.multiple.add(identiferRnaSiren[identifierName]);
                    acc.unique.delete(identiferRnaSiren[identifierName]);
                } else {
                    acc.unique.add(identiferRnaSiren[identifierName]);
                }
            }
            return acc;
        },
        { unique: new Set<string>(), multiple: new Set<string>() },
    );

    if (unique.size === 0) {
        throw new Error("No identifier found");
    }

    return unique.values().next().value;
}
