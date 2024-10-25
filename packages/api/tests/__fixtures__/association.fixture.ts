export const SIREN_STR = "100000000";
export const NIC_STR = "00001";
export const SIRET_STR = SIREN_STR + NIC_STR;
export const RNA = "W000000000";

export const LONELY_RNA = "W999999999";

const DEFAULT_ASSOCIATION = {
    siren: SIREN_STR,
    siret: SIRET_STR,
    rna: RNA,
    name: "DEFAULT_ASSOCIATION",
};

export default DEFAULT_ASSOCIATION;
