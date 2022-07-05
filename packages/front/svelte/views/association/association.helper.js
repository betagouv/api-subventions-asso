export const getAddress = address => {
    const { numero, type_voie, voie, code_postal, commune } = address;
    return `${numero || ""} ${type_voie?.toUpperCase() || ""} ${voie?.toUpperCase() || ""} ${code_postal || ""} ${
        commune.toUpperCase() || ""
    }`;
};

export const mapVersementsToSubventions = ({ subventions, versements }) => {
    console.log(subventions, versements);
    versements = versements.reduce(groupVersementsByEJ, {});
    return versements;
};

const groupVersementsByEJ = (obj, versement) => {
    if (!obj[versement.ej]) obj[versement.ej] = [];
    obj[versement.ej].push(versement);
    return obj;
};
