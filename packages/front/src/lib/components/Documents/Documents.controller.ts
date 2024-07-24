import type { Siren, Siret } from "dto";
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

export class DocumentsController {
    documentsPromise: Store<
        Promise<null | {
            assoDocs: DocumentEntity[];
            estabDocs: DocumentEntity[];
            headDocs: DocumentEntity[];
            some: boolean;
        }>
    >;
    element?: HTMLElement;
    zipPromise: Store<Promise<void | null>>;
    public selectedDocsOrNull: Store<{
        assoDocs: (DocumentEntity | undefined)[];
        estabDocs: (DocumentEntity | undefined)[];
        headDocs: (DocumentEntity | undefined)[];
    }>;
    public flatSelectedDocs: ReadStore<DocumentEntity[]>;
    private identifier: string;
    public downloadBtnLabel: ReadStore<string>;
    private allFlatDocs: DocumentEntity[];
    private headSiret: Siret;
    private assoSiren: Siren | undefined;

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
        this.allFlatDocs = [];
        this.selectedDocsOrNull = new Store({
            assoDocs: [],
            estabDocs: [],
            headDocs: [],
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

        const association = currentAssociation.value;
        this.headSiret = getSiegeSiret(association);
        this.assoSiren = association?.siren;
    }

    get resourceNameWithDemonstrative() {
        return resourceNameWithDemonstrativeByType[this.resourceType];
    }

    /* get and organize documents according to resource type */

    _getDocs() {
        return this._getEstablishmentDocuments(
            this.resourceType === "establishment"
                ? (this.resource as { siret: string }).siret
                : // ↓ head estab docs returns same docs as we want for an association: docs without siret and docs from head
                  this.headSiret,
        );
    }

    async _getEstablishmentDocuments(secondarySiret?: Siret) {
        const estabDocsPromise = secondarySiret
            ? establishmentService.getDocuments(secondarySiret)
            : Promise.resolve([]);
        // const assoDocsPromise = Promise.resolve([])
        const assoDocsPromise = associationService
            .getDocuments(this.assoSiren)
            .then(docs => this._filterAssoDocs(docs, secondarySiret || this.headSiret));
        const [estabDocs, assoDocs] = await Promise.all([estabDocsPromise, assoDocsPromise]);
        return this._removeDuplicates([...estabDocs, ...assoDocs]);
    }

    private _filterAssoDocs(docs: DocumentEntity[], siret: Siret) {
        // display rules from #2533: we show docs from asso, from head and from required secondary establishment if any
        return docs.filter(
            doc =>
                !doc.__meta__.siret ||
                doc.__meta__.siret === siret ||
                (doc.__meta__.siret === this.headSiret && doc.provider !== "Avis de Situation Insee"),
        );
    }

    _removeDuplicates(docs: DocumentEntity[]) {
        // association docs and establishment docs may be redundant
        // in fact establishment docs are always in association docs except for insee
        const docsByUrl = {};
        for (const doc of docs) {
            docsByUrl[doc.url] = doc;
        }
        return Object.values(docsByUrl) as DocumentEntity[];
    }

    _organizeDocuments(miscDocs: DocumentEntity[]) {
        const assoDocs: DocumentEntity[] = [];
        const headDocs: DocumentEntity[] = [];
        const estabDocs: DocumentEntity[] = [];
        for (const doc of miscDocs) {
            if (doc.provider === "RNA" || doc.provider === "Avis de Situation Insee") assoDocs.push(doc);
            else if (doc.__meta__.siret && doc.__meta__.siret !== this.headSiret) estabDocs.push(doc);
            else headDocs.push(doc);
        }
        return { assoDocs, estabDocs, headDocs, some: !!(assoDocs.length + estabDocs.length) };
    }

    async onMount() {
        // get documents on mount
        // Svelte component mounted so bind:this replaced this.element with current node element
        await waitElementIsVisible(this.element as HTMLElement);
        const promise = this._getDocs().then(docs => {
            this.allFlatDocs = docs;
            return this._organizeDocuments(docs);
        });
        this.documentsPromise.set(promise);
    }

    /* handle group download */

    async download() {
        let requestPromise: Promise<Blob>;
        if (this.flatSelectedDocs.value.length) requestPromise = this.downloadSelected();
        else requestPromise = this.downloadAll();
        const promise = requestPromise.then(blob => documentHelper.download(blob, `documents_${this.identifier}.zip`));
        setTimeout(() => {
            this.zipPromise.set(promise);
        }, 750); // weird if message appears and leaves right ahead ; quite arbitrary value
        await promise;
    }

    private downloadAll() {
        // this method does not actually download all docs available but all those displayed
        return documentService.getSomeDocs(this.allFlatDocs);
    }

    private downloadSelected() {
        const docs = this.flatSelectedDocs.value;
        return documentService.getSomeDocs(docs);
    }

    public resetSelection() {
        this.selectedDocsOrNull.set({
            assoDocs: [],
            estabDocs: [],
            headDocs: [],
        });
    }
}
