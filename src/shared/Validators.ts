
export function isSiret(siret: string): boolean {
    return typeof siret === "string" && /\d{14}/.test(siret);
}

export function isRna(rna: string): boolean {
    return typeof rna === "string" && /^W\d[A-Z\d]\d{7}$/.test(rna);
}

export function isAssociationName(name: string): boolean {
    return typeof name === "string" && name.length != 0
}

// Osiris && LeCompteAsso Part 

export function isCompteAssoId(compteAssoId: string): boolean {
    return typeof compteAssoId === "string" && compteAssoId.length === 9 && /\d{2}-\d{6}/.test(compteAssoId);
}

export function isOsirisRequestId(requestId: string): boolean {
    return typeof requestId === "string" && /[A-Z\d-]{4,16}/.test(requestId); // TODO: check if this rules is already true
}

export function isOsirisActionId(actionId: string): boolean {
    return typeof actionId === "string" && /[A-Z\d-]{4,16}/.test(actionId); // TODO: check if this rules is already true
}