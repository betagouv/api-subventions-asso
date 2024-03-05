import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import Store from "$lib/core/Store";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import { currentAssociation } from "$lib/store/association.store";
import type { ResourceType } from "$lib/types/ResourceType";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
import documentService from "$lib/resources/document/document.service";

const resourceNameWithDemonstrativeByType = {
    association: "cette association",
    establishment: "cet établissement",
};
const estabDocsTitleByType = {
    association: "Pièces complémentaires déposées par le siège social (via Le Compte Asso ou Dauphin)",
    establishment: "Pièces complémentaires déposées par l'établissement (via Le Compte Asso ou Dauphin)",
};

export class DocumentsController {
    documentsPromise: Store<
        Promise<null | {
            assoDocs: DocumentEntity[];
            estabDocs: DocumentEntity[];
            some: boolean;
        }>
    >;
    element?: HTMLElement;
    zipPromise: Store<Promise<void | null>>;

    constructor(
        public resourceType: ResourceType,
        // TODO: replace unknown with EstablishmentEntity when created
        public resource: AssociationEntity | unknown,
    ) {
        this.resourceType = resourceType;
        this.documentsPromise = new Store(new Promise(() => null));
        this.zipPromise = new Store(new Promise(resolve => resolve(null)));
        this.resource = resource;
    }

    get resourceNameWithDemonstrative() {
        return resourceNameWithDemonstrativeByType[this.resourceType];
    }

    get estabDocsTitle() {
        return estabDocsTitleByType[this.resourceType];
    }

    get _getterByType() {
        return this.resourceType === "establishment"
            ? struct => this._getEstablishmentDocuments(struct)
            : struct => this._getAssociationDocuments(struct);
    }

    async _getAssociationDocuments(association: AssociationEntity) {
        const associationDocuments = await associationService.getDocuments(association.rna || association.siren);
        return associationDocuments.filter(
            doc => !doc.__meta__.siret || doc.__meta__.siret === getSiegeSiret(association),
        );
    }

    _removeDuplicates(docs: DocumentEntity[]) {
        const docsByUrl = {};
        for (const doc of docs) {
            docsByUrl[doc.url] = doc;
        }
        return Object.values(docsByUrl) as DocumentEntity[];
    }

    async _getEstablishmentDocuments(establishment) {
        const association = currentAssociation.value;
        if (!association) return [];
        const estabDocsPromise = establishmentService.getDocuments(establishment.siret);
        const assoDocsPromise = associationService
            .getDocuments(association.rna || association.siren)
            .then(docs => docs.filter(doc => !doc.__meta__.siret || doc.__meta__.siret === establishment.siret));
        const [estabDocs, assoDocs] = await Promise.all([estabDocsPromise, assoDocsPromise]);
        return this._removeDuplicates([...estabDocs, ...assoDocs]);
    }

    _organizeDocuments(miscDocs: DocumentEntity[]) {
        const assoDocs: DocumentEntity[] = [];
        const estabDocs: DocumentEntity[] = [];
        for (const doc of miscDocs) {
            if (["Le Compte Asso", "Dauphin"].includes(doc.provider)) estabDocs.push(doc);
            if (["RNA", "Avis de Situation Insee"].includes(doc.provider)) assoDocs.push(doc);
        }
        return { assoDocs, estabDocs, some: !!(assoDocs.length + estabDocs.length) };
    }

    async onMount() {
        // Svelte component mounted so bind:this replaced this.element with current node element
        await waitElementIsVisible(this.element as HTMLElement);
        const promise = this._getterByType(this.resource).then(docs => this._organizeDocuments(docs));
        this.documentsPromise.set(promise);
    }

    async downloadAll() {
        // @ts-expect-error -- missing type
        const identifier = this.resource?.rna || this.resource?.siren || this.resource?.siret;
        const promise = documentService.getAllDocs(identifier).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `documents_${identifier}.zip`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
        });
    }
}
