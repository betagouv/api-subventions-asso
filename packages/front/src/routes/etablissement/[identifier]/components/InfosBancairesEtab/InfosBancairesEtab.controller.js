import { formatDate } from "$lib/helpers/dateHelper";
import { getDate, getProvider, getValue } from "$lib/helpers/providerValueHelper";

export class InfosBancairesEtabController {
    constructor(informationBancaireEtab) {
        this.infosBancaires = this._formatBankElement(informationBancaireEtab);
        this.headers = ["BIC", "IBAN", "Date de dépôt", "Source de dépôt"];
    }

    get hasInfo() {
        return this.infosBancaires.length > 0;
    }

    _formatBankElement(informationBancaireEtab) {
        return (
            informationBancaireEtab?.map(infoBancaireSourced => ({
                ...getValue(infoBancaireSourced),
                date: formatDate(getDate(infoBancaireSourced)),
                provider: getProvider(infoBancaireSourced),
            })) || []
        );
    }
}
