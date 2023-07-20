export const addressToString = address => {
    if (!address) return address;
    const { numero, type_voie, voie, code_postal, commune } = address;
    return [numero, type_voie, voie, code_postal, commune]
        .filter(str => str)
        .map(str => str.toUpperCase())
        .join(" ");
};

export const getAddress = association => {
    if (association.adresse_siege_rna) return addressToString(association.adresse_siege_rna);
    if (association.adresse_siege_siren) return addressToString(association.adresse_siege_siren);
    return null;
};

export const getImmatriculation = association => {
    return association.date_creation_rna || association.date_creation_siren || null;
};

export const getModification = association => {
    return association.date_modification_rna || association.date_modification_siren || null;
};

export const getSiegeSiret = association => association.siren + association.nic_siege;
