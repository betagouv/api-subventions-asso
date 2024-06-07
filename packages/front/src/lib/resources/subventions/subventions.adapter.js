import { valueOrHyphen, numberToEuro } from "$lib/helpers/dataHelper";
import { capitalizeFirstLetter } from "$lib/helpers/stringHelper";

export default class SubventionsAdapter {
    /**
     * @param {siret, subvention, payments} element Object that links an application to its related payments
     */
    static toSubvention(element) {
        const subvention = element.subvention;
        const dispositif = subvention.dispositif;
        const serviceInstructeur = subvention.service_instructeur;
        const projectName = this._getProjectName(subvention);
        const establishmentPostcode = subvention.establishment_postcode;

        return {
            establishmentPostcode: valueOrHyphen(establishmentPostcode),
            serviceInstructeur: valueOrHyphen(serviceInstructeur),
            dispositif: valueOrHyphen(dispositif),
            projectName: valueOrHyphen(projectName),
            montantsDemande: valueOrHyphen(numberToEuro(subvention.montants?.demande)),
            montantsAccorde: numberToEuro(subvention.montants?.accorde),
            status: subvention.statut_label,
        };
    }

    static _getProjectName(subvention) {
        if (!subvention.actions_proposee || !subvention.actions_proposee.length) return;

        let names = subvention.actions_proposee
            .sort((actionA, actionB) => actionA.rang - actionB.rang)
            .map(action => `${capitalizeFirstLetter(action.intitule)}.`.replace("..", "."));

        names = [...new Set(names)].join(" - ");

        return names;
    }
}
