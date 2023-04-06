import { waitElementIsVisible } from "../../helpers/visibilityHelper";
import associationService from "../../views/association/association.service";
import { getSiegeSiret } from "../../views/association/association.helper";
import etablissementService from "../../views/etablissement/etablissement.service";
import Store from "../../core/Store";

const resourceNameWithDemonstrativeByType = {
    association: "cette association",
    etablissement: "cet établissement",
};

export class DocumentsController {
    constructor(resourceType, resource) {
        this.resourceType = resourceType;
        this.element = new Store(null);
        this.documentsPromise = new Store(new Promise(() => null));
        this.resource = resource;
    }

    get resourceNameWithDemonstrative() {
        return resourceNameWithDemonstrativeByType[this.resourceType];
    }

    getDateString(date) {
        if (date.getTime() === 0) return "Date de dépôt non disponible";
        return `Déposé le ${date.toLocaleDateString()}`;
    }

    get getterByType() {
        return {
            etablissement: this.getEtablissementDocuments,
            association: this.getAssociationDocuments,
        };
    }

    async getAssociationDocuments(association) {
        const associationDocuments = await associationService.getDocuments(association.rna || association.siren);
        return associationDocuments.filter(
            doc => !doc.__meta__.siret || doc.__meta__.siret === getSiegeSiret(association),
        );
    }

    getEtablissementDocuments(etablissement) {
        return etablissementService.getDocuments(etablissement.siret);
    }

    async onMount() {
        await waitElementIsVisible(this.element);
        const promise = this.getterByType[this.resourceType](this.resource);
        this.documentsPromise.set(promise);
    }
}
