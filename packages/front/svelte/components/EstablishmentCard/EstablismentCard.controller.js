import etablissementService from "../../views/etablissement/etablissement.service";
import { addressToString } from "../../views/association/association.helper";
import { valueOrHyphen } from "@helpers/dataHelper";

export class EstablismentCardController {
    constructor(assoName, etab) {
        this.siret = valueOrHyphen(etab.siret);
        this.status = etablissementService.getEtablissementStatus(etab);
        this.assoName = assoName;
        this.address = valueOrHyphen(addressToString(etab.adresse));
        this.url = etab.siret ? `/etablissement/${etab.siret}` : undefined;
    }
}
