import lodash from "lodash";
import { sortByDateAsc, isValidDate } from "../../helpers/dateHelper";

export const getAddress = address => {
    if (!address) return address;
    const { numero, type_voie, voie, code_postal, commune } = address;
    return `${numero || ""} ${type_voie?.toUpperCase() || ""} ${voie?.toUpperCase() || ""} ${code_postal || ""} ${
        commune.toUpperCase() || ""
    }`;
};

const isVersementValid = versement => {
    return isValidDate(new Date(versement.dateOperation)) && typeof versement.amount == "number";
};

const linkVersementsToSubvention = elements =>
    elements.reduce((acc, group) => {
        const subventions = group.filter(element => element.isSub);
        const versements = group.filter(element => element.isVersement && isVersementValid(element));

        // CAS 1 : plusieurs subventions par clé (uniquement FONJEP ?)
        if (subventions.length > 1) {
            subventions.forEach(subvention => {
                const subventionVersements = versements.filter(
                    versement => new Date(versement.periodeDebut).getFullYear() == subvention.annee_demande
                );
                const siret = subvention.siret || subventionVersements.find(v => v.siret)?.siret;
                // ATM annee_demande est toujours renseignée dans les exports FONJEP
                // À voir si on fait un cas particulier si il y a des subventions sans annee renseignée
                // avec des versements qui se retrouveraient orphelins
                if (subvention.annee_demande) {
                    acc.push({
                        subvention,
                        versements: subventionVersements,
                        siret,
                        date: new Date(subvention.annee_demande),
                        year: subvention.annee_demande
                    });
                } else {
                    acc.push({
                        subvention,
                        versements: subventionVersements,
                        siret,
                        date: null,
                        year: null
                    });
                }
            });
        } else if (subventions.length == 1) {
            const subvention = subventions[0];
            acc.push({
                subvention,
                versements: versements,
                date: new Date(subvention.annee_demande),
                year: subvention.annee_demande
            });
        }
        return acc;
    }, []);

export const mapSubventionsAndVersements = ({ subventions, versements }) => {
    const taggedSubventions = subventions.map(s => ({ ...s, isSub: true }));
    const taggedVersements = versements.map(s => ({ ...s, isVersement: true }));

    const elementsGroupedByVersementKey = [...taggedSubventions, ...taggedVersements].reduce(groupByVersementKey, {
        ej: {},
        codePoste: {},
        none: []
    });

    const flatenElements = [
        ...Object.values(elementsGroupedByVersementKey.ej),
        ...Object.values(elementsGroupedByVersementKey.codePoste),
        ...elementsGroupedByVersementKey.none
    ];

    const uniformizedElements = linkVersementsToSubvention(flatenElements);

    return uniformizedElements.sort(sortByDateAsc);
};

const groupByVersementKey = (acc, curr) => {
    // Osiris / Chorus
    if (curr.ej) {
        if (!acc.ej[curr.ej]) acc.ej[curr.ej] = [];
        acc.ej[curr.ej].push(curr);
        return acc;
    }
    const fonjepKey = curr.codePoste || curr.versementKey;
    // Fonjep
    if (fonjepKey) {
        if (!acc.codePoste[fonjepKey]) acc.codePoste[fonjepKey] = [];
        acc.codePoste[fonjepKey].push(curr);
    }
    // Wrap it in array for ease of use (every sub item is an array)
    else acc.none.push([curr]);
    return acc;
};

export const getLastVersementsDate = versements => {
    const orderedVersements = versements.sort((versementA, versementB) => {
        const dateA = new Date(versementA.dateOperation);
        const dateB = new Date(versementB.dateOperation);

        return dateA.getTime() - dateB.getTime();
    });

    if (!orderedVersements.length) return null;

    return new Date(orderedVersements[0].dateOperation);
};

export const sortByColumn = (elements, path) => {
    return elements.sort((elementA, elementB) => {
        let attributeA;
        let attributeB;

        if (path.includes("lastDate")) {
            attributeA = getLastVersementsDate(elementA.versements || []);
            attributeB = getLastVersementsDate(elementB.versements || []);
        } else if (path.includes("amount")) {
            attributeA = elementA.versements?.reduce((acc, versement) => acc + versement.amount, 0);
            attributeB = elementB.versements?.reduce((acc, versement) => acc + versement.amount, 0);
        } else {
            attributeA = lodash.get(elementA, path);
            attributeB = lodash.get(elementB, path);
        }

        if (!attributeA && !attributeB) return sortByDateAsc(elementB, elementA);
        else if (!attributeA) return 1;
        else if (!attributeB) return -1;

        if (typeof attributeA == "number" || !isNaN(Number(attributeA))) {
            return attributeB - attributeA;
        }

        // Check if string is date
        const dateA = new Date(attributeA);
        const dateB = new Date(attributeB);

        if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateB.getTime() - dateA.getTime();
        }

        if (attributeB.toLowerCase() > attributeA.toLowerCase()) return 1;
        if (attributeB.toLowerCase() < attributeA.toLowerCase()) return -1;

        return sortByDateAsc(elementB, elementA);
    });
};
