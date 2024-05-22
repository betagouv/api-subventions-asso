export const SIREN = "100000000";
export const NIC = "00001";
export const SIRET = SIREN + NIC;
export const RNA = "W000000000";

const DEFAULT_ASSOCIATION = {
    siren: SIREN,
    siret: SIRET,
    rna: RNA,
};

export default DEFAULT_ASSOCIATION;
