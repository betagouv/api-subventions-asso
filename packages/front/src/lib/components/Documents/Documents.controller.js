import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import Store from "$lib/core/Store";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import documentService from "$lib/resources/documents/documents.service";
import trackerService from "$lib/services/tracker.service";

const resourceNameWithDemonstrativeByType = {
    association: "cette association",
    establishment: "cet établissement",
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
            establishment: this.getEstablishmentDocuments,
            association: this.getAssociationDocuments,
        };
    }

    async getAssociationDocuments(association) {
        const associationDocuments = await associationService.getDocuments(association.rna || association.siren);
        return associationDocuments.filter(
            doc => !doc.__meta__.siret || doc.__meta__.siret === getSiegeSiret(association),
        );
    }

    getEstablishmentDocuments(establishment) {
        return establishmentService.getDocuments(establishment.siret);
    }

    async onMount() {
        await waitElementIsVisible(this.element);
        const promise = this.getterByType[this.resourceType](this.resource);
        this.documentsPromise.set(promise);
    }

    async onClick(event, doc) {
        trackerService.buttonClickEvent("association-etablissement.documents.download", doc.url);

        // authenticated calls to our api when provider have private access to files
        if (!this.isInternalLink(doc.url)) return;
        event.preventDefault();
        const blob = await documentService.getDauphinBlob(doc.url);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc.nom);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
