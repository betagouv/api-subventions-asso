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

export function getUniqueIdentifier(identifiers) {
    const { unique } = identifiers.reduce(
        (acc, identiferRnaSiren) => {
            if (acc.multiple.has(identiferRnaSiren.rna) || acc.multiple.has(identiferRnaSiren.siren)) {
                return acc;
            }

            for (const identifierName in identiferRnaSiren) {
                if (!identiferRnaSiren[identifierName]) continue;
                if (acc.unique.has(identiferRnaSiren[identifierName])) {
                    acc.multiple.add(identiferRnaSiren[identifierName]);
                    acc.unique.delete(identiferRnaSiren[identifierName]);
                } else {
                    acc.unique.add(identiferRnaSiren[identifierName]);
                }
            }
            return acc;
        },
        { unique: new Set(), multiple: new Set() },
    );
    return unique.size >= 1 ? unique.values().next().value : undefined;
}
