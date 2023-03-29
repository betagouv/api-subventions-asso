import { ApplicationStatus } from "@api-subventions-asso/dto";
import { valueOrHyphen, numberToEuro } from "@helpers/dataHelper";
import { trim } from "@helpers/stringHelper";
import { capitalizeFirstLetter } from "@helpers/textHelper";

export default class SubventionsAdapter {
    static MAX_CHAR_SIZE = 63;

    static toSubvention(subvention, trimValue = true) {
        const sizedTrim = value => (value ? trim(value, this.MAX_CHAR_SIZE) : value);

        let dispositif = subvention.dispositif;
        let serviceInstructeur = subvention.service_instructeur;
        let projectName = this._getProjectName(subvention);

        if (trimValue) {
            dispositif = sizedTrim(dispositif);
            serviceInstructeur = sizedTrim(serviceInstructeur);
            projectName = sizedTrim(projectName, this.MAX_CHAR_SIZE);
        }

        return {
            serviceInstructeur: valueOrHyphen(serviceInstructeur),
            dispositif: valueOrHyphen(dispositif),
            projectName: valueOrHyphen(projectName),
            montantsDemande: valueOrHyphen(numberToEuro(subvention.montants?.demande)),
            montantsAccorde: numberToEuro(subvention.montants?.accorde),
            status: subvention.statut_label,
            showAmount: subvention.statut_label === ApplicationStatus.GRANTED && subvention.montants?.accorde
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
