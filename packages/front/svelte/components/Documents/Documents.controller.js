import { writable } from "svelte/store";
import { waitElementIsVisible } from "../../helpers/visibilityHelper";
import associationService from "../../views/association/association.service";
import { getSiegeSiret } from "../../views/association/association.helper";
import etablissementService from "../../views/etablissement/etablissement.service";

const resourceNameWithDemonstrativeByType = {
    association: "cette association",
    etablissement: "cet établissement"
};

export class DocumentsController {
    constructor(resourceType, resource) {
        this.resourceType = resourceType;
        this.element = writable(null);
        this.documentsPromise = writable(new Promise(() => null));
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            etablissement: this.getEtablissementDocuments,
            association: this.getAssociationDocuments
        };
    }

    async getAssociationDocuments(association) {
        const associationDocuments = await associationService.getDocuments(association.rna || association.siren);
        return Promise.resolve(
            associationDocuments.filter(doc => !doc.__meta__.siret || doc.__meta__.siret === getSiegeSiret(association))
        );
    }

    async getEtablissementDocuments(etablissement) {
        return etablissementService.getDocuments(etablissement.siret);
    }

    async onMount() {
        await waitElementIsVisible(this.element);
        const promise = this.getterByType[this.resourceType](this.resource);
        this.documentsPromise.set(promise);
        promise.then(v => console.log(v));
    }
}
