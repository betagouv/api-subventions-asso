import DateHelper from "../../../../../src/shared/helpers/DateHelper";
import { getDate, getProvider, getValue } from "../../../../helpers/providerValueHelper";

export class InfosBancairesEtabController {
    constructor(informationBancaireEtab) {
        this.infosBancaires = this._formatBankElement(informationBancaireEtab);
        this.headers = ["BIC", "IBAN", "Date de dépôt", "Source de dépôt"];
    }

    _formatBankElement(informationBancaireEtab) {
        return (
            informationBancaireEtab?.flat()?.map(infoBancaireSourced => ({
                ...getValue(infoBancaireSourced),
                date: DateHelper.formatDate(getDate(infoBancaireSourced)),
                provider: getProvider(infoBancaireSourced)
            })) || []
        );
    }
}
