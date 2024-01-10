export function isSiret(siret) {
    return typeof siret === "string" && /^\d{14}/.test(siret);
}

export function isStartOfSiret(siret) {
    return typeof siret === "string" && /^\d{9,14}/.test(siret);
}

export function isSiren(siren) {
    return typeof siren === "string" && /^\d{9}$/.test(siren);
}

export function isRna(rna) {
    if (!rna) return false;
    return typeof rna === "string" && /^W\d[A-Z\d]\d{7}$/.test(rna);
}

export function isIdentifier(identifier) {
    return isRna(identifier) || isSiren(identifier) || isSiret(identifier);
}
