import { writable } from "svelte/store";
import DateHelper from "../../../../src/shared/helpers/DateHelper";
import { getDate, getProvider, getValue } from "../../../helpers/providerValueHelper";

function formatBankElement(informationBancaireEtab) {
    return informationBancaireEtab.flat().map(infoBancaireSourced => ({
        ...getValue(infoBancaireSourced),
        date: DateHelper.formatDate(getDate(infoBancaireSourced)),
    }));
}

export class InfosBancairesEtabController {
    constructor(informationBancaireEtab) {
        this.infosBancaires = writable(formatBankElement(informationBancaireEtab));
    }
}
