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

        const lastSub = subventions.reduce((lastSub, curr) => {
            if (!lastSub) return curr;

            if (lastSub.date_fin < curr.date_fin) return curr;
            return lastSub;
        }, null);

        const siret = lastSub?.siret || versements.find(v => v.siret)?.siret;
        acc.push({
            subvention: lastSub,
            versements: versements,
            siret,
            date: lastSub?.annee_demande ? new Date(lastSub.annee_demande) : getLastVersementsDate(versements),
            year: lastSub?.annee_demande ? lastSub.annee_demande : getLastVersementsDate(versements).getFullYear()
        });

        return acc;
    }, []);

export const mapSubventionsAndVersements = ({ subventions, versements }) => {
    const taggedSubventions = subventions.map(s => ({ ...s, isSub: true }));
    const taggedVersements = versements.map(s => ({ ...s, isVersement: true }));

    const elementsGroupedByVersementKey = [...taggedSubventions, ...taggedVersements].reduce(groupByVersementKey, {
        none: [],
        withKey: {}
    });
    const flatenElements = [
        ...Object.values(elementsGroupedByVersementKey.withKey),
        ...elementsGroupedByVersementKey.none
    ];

    const uniformizedElements = linkVersementsToSubvention(flatenElements);
    return uniformizedElements.sort(sortByDateAsc);
};

const getYearOfItem = item => {
    if (item.isSub) return item.annee_demande;
    if (item.periodeDebut) return new Date(item.periodeDebut).getFullYear();
    return "";
};

const groupByVersementKey = (acc, curr) => {
    if (!curr.versementKey) {
        // impossible de lier car pas de clef de liaison
        acc.none.push([curr]);
        return acc;
    }

    const key = curr.versementKey + "-" + getYearOfItem(curr); // Discuter avec maxime pour faire cette manip cotée api

    if (!acc.withKey[key]) acc.withKey[key] = [];

    acc.withKey[key].push(curr);

    return acc;
};

export const getLastVersementsDate = versements => {
    const orderedVersements = versements.sort((versementA, versementB) => {
        const dateA = new Date(versementA.dateOperation);
        const dateB = new Date(versementB.dateOperation);

        return dateB.getTime() - dateA.getTime();
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
