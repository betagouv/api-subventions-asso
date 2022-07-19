import lodash from "lodash";
import { sortByDateAsc } from "../../helpers/dateHelper";

export const getAddress = address => {
    const { numero, type_voie, voie, code_postal, commune } = address;
    return `${numero || ""} ${type_voie?.toUpperCase() || ""} ${voie?.toUpperCase() || ""} ${code_postal || ""} ${
        commune.toUpperCase() || ""
    }`;
};

export const mapSubventionsAndVersements = ({ subventions, versements }) => {
    const groupedByEj = groupByEj([
        ...subventions.map(s => ({ ...s, isSub: true })),
        ...versements.map(s => ({ ...s, isVersement: true }))
    ]);

    if (!Object.keys(groupedByEj).length) return [];

    const dataWithoutEj = groupedByEj["undefined"]?.map(sub => [sub]) || [];

    delete groupedByEj["undefined"];

    const uniformizedElements = [...Object.values(groupedByEj), ...dataWithoutEj].reduce((acc, group) => {
        const subvention = group.find(element => element.isSub);
        const versements = group.filter(element => element.isVersement);
        const siret = subvention?.siret || versements?.find(v => v.siret)?.siret;
        const dateString = subvention?.date_commision || getLastVersementsDate(versements);
        const date = dateString ? new Date(dateString) : null;
        const year = date ? date.getFullYear() : subvention ? subvention.annee_demande : null;

        acc.push({
            versements: versements.length ? versements : null,
            subvention,
            siret,
            date,
            year
        });
        return acc;
    }, []);

    return uniformizedElements.sort(sortByDateAsc);
};

const groupByEj = elements =>
    elements.reduce((obj, element) => {
        const ej = element.ej?.toLowerCase().trim();
        if (!obj[ej]) obj[ej] = [];
        obj[ej].push(element);
        return obj;
    }, {});

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
        let attributeA = lodash.get(elementA, path);
        let attributeB = lodash.get(elementB, path);

        if (path.includes("lastDate")) {
            attributeA = getLastVersementsDate(elementA.versements || []);
            attributeB = getLastVersementsDate(elementB.versements || []);
        }

        if (path.includes("amount")) {
            attributeA = elementA.versements?.reduce((acc, versement) => acc + versement.amount, 0);
            attributeB = elementB.versements?.reduce((acc, versement) => acc + versement.amount, 0);
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
