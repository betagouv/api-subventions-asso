export const addressToOneLineString = address => {
    if (!address) return address;
    const { numero, type_voie, voie, code_postal, commune } = address;
    return [numero, type_voie, voie, code_postal, commune]
        .filter(str => str)
        .map(str => str.toUpperCase())
        .join(" ");
};

export const getFirstPartAddress = address => {
    if (!address) return address;
    const { numero, type_voie, voie } = address;
    return [numero, type_voie, voie]
        .filter(str => str)
        .map(str => str.toUpperCase())
        .join(" ");
};

export const getLastPartAddress = address => {
    if (!address) return address;
    const { code_postal, commune } = address;
    return [code_postal, commune]
        .filter(str => str)
        .map(str => str.toUpperCase())
        .join(" ");
};

export const getAddress = association => {
    if (association.adresse_siege_rna) return association.adresse_siege_rna;
    if (association.adresse_siege_siren) return association.adresse_siege_siren;
    return null;
};

export const toSearchHistory = association => {
    return {
        rna: association.rna,
        siren: association.siren,
        name: association.denomination_rna || association.denomination_siren,
        address: getAddress(association),
        // TODO: find a better way to do retrieve the number of etabs ?
        nbEtabs: association.etablisements_siret.length,
    };
};

export const getImmatriculation = association => {
    return association.date_creation_rna || association.date_creation_siren || null;
};

export const getModification = association => {
    return association.date_modification_rna || association.date_modification_siren || null;
};

export const getSiegeSiret = association => association.siren + association.nic_siege;
