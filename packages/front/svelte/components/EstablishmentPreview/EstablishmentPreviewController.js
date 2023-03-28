import etablissementService from "../../views/etablissement/etablissement.service";
import { addressToString } from "../../views/association/association.helper";
import { valueOrHyphen } from "@helpers/dataHelper";

export class EstablishmentPreviewController {
    constructor(etab) {
        this.siret = valueOrHyphen(etab.siret);
        this.status = etablissementService.getEtablissementStatus(etab);
        this.address = valueOrHyphen(addressToString(etab.adresse));
    }
}
