import { valueOrHyphen } from "@helpers/dataHelper";
import { addressToString } from "../../views/association/association.helper";

export class EstablishmentPreviewController {
    constructor(etab) {
        this.siret = valueOrHyphen(etab.siret);
        this.status = this.getEtablissementStatus(etab);
        this.address = valueOrHyphen(addressToString(etab.adresse));
    }

    getEtablissementStatus(etab) {
        if (etab.siege) return "Établissement siège";
        if (!etab.ouvert) return "-- Établissement fermé --";
        return "Établissement secondaire";
    }
}
