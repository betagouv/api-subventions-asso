import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import Store from "$lib/core/Store";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import { currentAssociation } from "$lib/store/association.store";

const resourceNameWithDemonstrativeByType = {
    association: "cette association",
    establishment: "cet établissement",
};
const etabDocsTitleByType = {
    association: "Pièces complémentaires déposées par le siège social (via Le Compte Asso ou Dauphin)",
    establishment: "Pièces complémentaires déposées par l'établissement (via Le Compte Asso ou Dauphin)",
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

    get etabDocsTitle() {
        return etabDocsTitleByType[this.resourceType];
    }

    get _getterByType() {
        return this.resourceType === "establishment"
            ? struct => this._getEstablishmentDocuments(struct)
            : struct => this._getAssociationDocuments(struct);
    }

    async _getAssociationDocuments(association) {
        const associationDocuments = await associationService.getDocuments(association.rna || association.siren);
        return associationDocuments.filter(
            doc => !doc.__meta__.siret || doc.__meta__.siret === getSiegeSiret(association),
        );
    }

    _removeDuplicates(docs) {
        const docsByUrl = {};
        for (const doc of docs) {
            docsByUrl[doc.url] = doc;
        }
        return Object.values(docsByUrl);
    }

    async _getEstablishmentDocuments(establishment) {
        const association = currentAssociation.value;
        const etabDocsPromise = establishmentService.getDocuments(establishment.siret);
        const assoDocsPromise = associationService
            .getDocuments(association.rna || association.siren)
            .then(docs => docs.filter(doc => !doc.__meta__.siret || doc.__meta__.siret === establishment.siret));
        const [etabDocs, assoDocs] = await Promise.all([etabDocsPromise, assoDocsPromise]);
        return this._removeDuplicates([...etabDocs, ...assoDocs]);
    }

    _organizeDocuments(miscDocs) {
        const assoDocs = [];
        const etabDocs = [];
        for (const doc of miscDocs) {
            if (["Le Compte Asso", "Dauphin"].includes(doc.provider)) etabDocs.push(doc);
            if (["RNA", "Avis de Situation Insee"].includes(doc.provider)) assoDocs.push(doc);
        }
        return { assoDocs, etabDocs, some: !!(assoDocs.length + etabDocs.length) };
    }

    async onMount() {
        await waitElementIsVisible(this.element);
        const promise = this._getterByType(this.resource).then(docs => this._organizeDocuments(docs));
        this.documentsPromise.set(promise);
    }
}
