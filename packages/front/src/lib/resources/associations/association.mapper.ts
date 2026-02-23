import { getAddress } from "./association.helper";

export const toSearchHistory = association => {
    return {
        rna: association.rna,
        siren: association.siren,
        name: association.denomination_rna || association.denomination_siren,
        address: getAddress(association),
        nbEtabs: association.etablisements_siret?.length || 0,
    };
};
