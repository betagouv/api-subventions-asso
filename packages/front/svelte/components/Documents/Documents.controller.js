import associationService from "../../views/association/association.service";
import { getSiegeSiret } from "../../views/association/association.helper";
import etablissementService from "../../views/etablissement/etablissement.service";
import Store from "../../core/Store";
import { waitElementIsVisible } from "@helpers/visibilityHelper";
import documentService from "@resources/documents/documents.service";

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

    isInternalLink(link) {
        const isAbsoluteUrl = new RegExp("^(?:[a-z+]+:)?//", "i");
        return !isAbsoluteUrl.test(link);
    }

    async onClick(event, doc) {
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
