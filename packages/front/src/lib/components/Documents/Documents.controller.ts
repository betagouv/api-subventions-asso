import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import Store, { derived, ReadStore } from "$lib/core/Store";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import { currentAssociation } from "$lib/store/association.store";
import type { ResourceType } from "$lib/types/ResourceType";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
import documentService from "$lib/resources/document/document.service";
import documentHelper from "$lib/helpers/document.helper";
import { returnInfinitePromise } from "$lib/helpers/promiseHelper";

const resourceNameWithDemonstrativeByType = {
    association: "cette association",
    establishment: "cet établissement",
};
const estabDocsTitleByType = {
    association: "Pièces complémentaires déposées par le siège social",
    establishment: "Pièces complémentaires déposées par l'établissement",
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
    public selectedDocsOrNull: Store<{
        assoDocs: (DocumentEntity | undefined)[];
        estabDocs: (DocumentEntity | undefined)[];
    }>;
    public flatSelectedDocs: ReadStore<DocumentEntity[]>;
    private identifier: string;
    public downloadBtnLabel: ReadStore<string>;

    constructor(
        public resourceType: ResourceType,
        // TODO: replace unknown with EstablishmentEntity when created
        public resource: AssociationEntity | unknown,
    ) {
        // @ts-expect-error -- missing type
        this.identifier = resource?.rna || resource?.siren || resource?.siret;
        this.resourceType = resourceType;
        this.documentsPromise = new Store(returnInfinitePromise());
        this.zipPromise = new Store(Promise.resolve(null));
        this.resource = resource;
        this.selectedDocsOrNull = new Store({
            assoDocs: [],
            estabDocs: [],
        });
        this.flatSelectedDocs = derived(this.selectedDocsOrNull, nested =>
            Object.values(nested).reduce(
                (flatDocs: DocumentEntity[], docs) => [...flatDocs, ...(docs.filter(doc => !!doc) as DocumentEntity[])],
                [],
            ),
        );
        this.downloadBtnLabel = derived(this.flatSelectedDocs, docs =>
            docs.length ? `Télécharger la sélection (${docs.length})` : "Tout télécharger",
        );
    }

    get resourceNameWithDemonstrative() {
        return resourceNameWithDemonstrativeByType[this.resourceType];
    }

    get estabDocsTitle() {
        return estabDocsTitleByType[this.resourceType];
    }

    /* get and organize documents according to resource type */

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

    _organizeDocuments(miscDocs: DocumentEntity[]) {
        const assoDocs: DocumentEntity[] = [];
        const estabDocs: DocumentEntity[] = [];
        for (const doc of miscDocs) {
            if (["Le Compte Asso", "Dauphin"].includes(doc.provider)) estabDocs.push(doc);
            if (["RNA", "Avis de Situation Insee"].includes(doc.provider)) assoDocs.push(doc);
        }
        return { assoDocs, estabDocs, some: !!(assoDocs.length + estabDocs.length) };
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

    async onMount() {
        // get documents on mount
        // Svelte component mounted so bind:this replaced this.element with current node element
        await waitElementIsVisible(this.element as HTMLElement);
        const promise = this._getterByType(this.resource).then(docs => this._organizeDocuments(docs));
        this.documentsPromise.set(promise);
    }

    /* handle group download */

    async download() {
        let requestPromise: Promise<Blob>;
        if (this.flatSelectedDocs.value.length) requestPromise = this.downloadSome();
        else requestPromise = this.downloadAll();
        const promise = requestPromise.then(blob => documentHelper.download(blob, `documents_${this.identifier}.zip`));
        setTimeout(() => {
            this.zipPromise.set(promise);
        }, 750); // weird if message appears and leaves right ahead ; quite arbitrary value
        await promise;
    }

    private downloadAll() {
        return documentService.getAllDocs(this.identifier);
    }

    private downloadSome() {
        const docs = this.flatSelectedDocs.value;
        return documentService.getSomeDocs(docs);
    }
}
