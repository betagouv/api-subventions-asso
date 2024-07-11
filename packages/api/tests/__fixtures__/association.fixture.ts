export const SIREN = "100000000";
export const NIC = "00001";
export const SIRET = SIREN + NIC;
export const RNA = "W000000000";

export const LONELY_RNA = "W999999999";

const DEFAULT_ASSOCIATION = {
    siren: SIREN,
    siret: SIRET,
    rna: RNA,
    name: "DEFAULT_ASSOCIATION",
};

export default DEFAULT_ASSOCIATION;
