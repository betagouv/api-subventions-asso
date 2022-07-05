import { sortByDateAsc } from "../../helpers/dateHelper";

export const getAddress = address => {
    const { numero, type_voie, voie, code_postal, commune } = address;
    return `${numero || ""} ${type_voie?.toUpperCase() || ""} ${voie?.toUpperCase() || ""} ${code_postal || ""} ${
        commune.toUpperCase() || ""
    }`;
};

export const mapSubventionsAndVersements = ({ subventions, versements }) => {
    const versementsGroupByEJ = groupVersementsByEJ(versements);

    function mapVersementsToSubventions() {
        return subventions.map(subvention => {
            const newObj = { subvention };
            const EJ = subvention.ej;
            if (EJ && versementsGroupByEJ[EJ]) {
                newObj.versements = versementsGroupByEJ[EJ];
                delete versements[EJ];
            } else newObj.versements = null;
        });
    }

    const subventionsWithVersements = mapVersementsToSubventions();

    // const allSubventionsAndVersements = [
    //     ...subventionsWithVersements,
    //     versementsGroupByEJ.map(versements => ({ subvention: null, versements }))
    // ];
    // const allSubventionsAndVersementsWithDate = allSubventionsAndVersements.forEach(item => {
    //     if (item.date_commission) item.date;
    //     item.versements ? (item.date = item.date_commission) : (item.date = item.date_operation);
    // });
    // const allSortedSubventionsAndVersements = allSubventionsAndVersements.sort(sortByDateAsc);
};

const groupVersementsByEJ = versements =>
    versements.reduce((obj, versement) => {
        if (!obj[versement.ej]) obj[versement.ej] = [];
        obj[versement.ej].push(versement);
        return obj;
    }, {});
