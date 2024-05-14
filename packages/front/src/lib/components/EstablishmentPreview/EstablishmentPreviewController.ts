import type { Siret } from "dto";
import { addressToOneLineString } from "$lib/resources/associations/association.helper";
import { valueOrHyphen } from "$lib/helpers/dataHelper";

export class EstablishmentPreviewController {
    public siret: Siret;
    public status: "Établissement siège" | "Établissement secondaire";
    public address: string;
    constructor(etab) {
        this.siret = valueOrHyphen(etab.siret);
        this.status = this.getEtablissementStatus(etab);
        this.address = valueOrHyphen(addressToOneLineString(etab.adresse));
    }

    getEtablissementStatus(etab) {
        if (etab.siege) return "Établissement siège";
        return "Établissement secondaire";
    }
}
