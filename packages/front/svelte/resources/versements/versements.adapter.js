import { valueOrHyphen, numberToEuro } from "@helpers/dataHelper";
import { withTwoDigitYear } from "@helpers/dateHelper";

export default class VersementsAdapter {
    static toVersement(versements) {
        return {
            totalAmount: numberToEuro(this._countTotalVersement(versements)),
            centreFinancier: valueOrHyphen(versements[0]?.centreFinancier),
            lastVersementDate: valueOrHyphen(withTwoDigitYear(this._getLastVersementsDate(versements)))
        };
    }

    static _countTotalVersement(versements) {
        return versements.reduce((acc, versement) => acc + versement.amount, 0);
    }

    static _getLastVersementsDate = versements => {
        const orderedVersements = versements.sort((versementA, versementB) => {
            const dateA = new Date(versementA.dateOperation);
            const dateB = new Date(versementB.dateOperation);

            return dateB.getTime() - dateA.getTime();
        });

        if (!orderedVersements.length) return null;

        return new Date(orderedVersements[0].dateOperation);
    };
}
