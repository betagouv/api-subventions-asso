import { writable } from "svelte/store";
import helper from "../../../../src/shared/helpers/ProviderValueHelper";
import DateHelper from "../../../../src/shared/helpers/DateHelper";

function formatBankElement(informationBancaireEtab) {
    return informationBancaireEtab.flat().map(infoBancaireSourced => ({
        ...helper.getValue(infoBancaireSourced),
        date: DateHelper.formatDate(helper.getDate(infoBancaireSourced))
    }));
}

export class InfosBancairesEtabController {
    constructor(informationBancaireEtab) {
        this.infosBancaires = writable(formatBankElement(informationBancaireEtab));
    }
}
