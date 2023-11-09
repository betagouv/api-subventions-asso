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

export const getNbEtab = association => {
    const etabsSiret = association.etablissements_siret;
    // not define or only containing one raw siret = no other establishment than the main one
    if (!etabsSiret || typeof etabsSiret[0] === "string") return 1;
    // value from ApiAsso SIREN is an array of SIRET
    const apiAssoEtabs = etabsSiret.find(providerValue => providerValue.provider == "SIREN");
    if (apiAssoEtabs) return apiAssoEtabs.value.length;
    // TODO: else ?
};

export const toSearchHistory = association => {
    return {
        rna: association.rna,
        siren: association.siren,
        name: association.denomination_rna || association.denomination_siren,
        address: getAddress(association),
        // TODO: find a better way to do retrieve the number of etabs ?
        nbEtabs: getNbEtab(association),
    };
};

export const getImmatriculation = association => {
    return association.date_creation_rna || association.date_creation_siren || null;
};

export const getModification = association => {
    return association.date_modification_rna || association.date_modification_siren || null;
};

export const getSiegeSiret = association => association.siren + association.nic_siege;
