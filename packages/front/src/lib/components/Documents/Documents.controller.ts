import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import Store, { derived, ReadStore } from "$lib/core/Store";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import { currentAssociation } from "$lib/store/association.store";
import type { ResourceType } from "$lib/types/ResourceType";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import type AssociationEntity from "$lib/resources/associations/entities/AssociationEntity";
import documentService, { type LabeledDoc } from "$lib/resources/document/document.service";
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

const sortLabeledDocs = (docs: LabeledDoc[]) =>
    docs.sort((docA, docB) => Number(docB.showByDefault) - Number(docA.showByDefault));

type GroupedDocs = null | {
    assoDocs: LabeledDoc[];
    estabDocs: LabeledDoc[];
    moreAssoDocs: LabeledDoc[];
    moreEstabDocs: LabeledDoc[];
    someAsso: boolean;
    someEstab: boolean;
    some: boolean;
    fullSome: boolean;
};

export class DocumentsController {
    documentsPromise;
    element?: HTMLElement;
    zipPromise: Store<Promise<void | null>>;
    public showMoreAsso: Store<boolean>;
    public showMoreEstab: Store<boolean>;
    public selectedDocsOrNull: Store<{
        assoDocs: (DocumentEntity | undefined)[];
        estabDocs: (DocumentEntity | undefined)[];
        moreAssoDocs: (DocumentEntity | undefined)[];
        moreEstabDocs: (DocumentEntity | undefined)[];
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
        this.showMoreAsso = new Store(false);
        this.showMoreEstab = new Store(false);
        this.selectedDocsOrNull = new Store({
            assoDocs: [],
            estabDocs: [],
            moreAssoDocs: [],
            moreEstabDocs: [],
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
        return documentService.labelAssoDocsBySiret(associationDocuments, getSiegeSiret(association));
    }

    async _getEstablishmentDocuments(establishment): Promise<LabeledDoc[]> {
        const association = currentAssociation.value;
        if (!association) return [];
        const estabDocsPromise: Promise<LabeledDoc[]> = establishmentService
            .getDocuments(establishment.siret)
            .then(docs => docs.map(doc => ({ ...doc, showByDefault: true } as LabeledDoc)));
        const assoDocsPromise = associationService
            .getDocuments(association.rna || association.siren)
            .then(docs => documentService.labelAssoDocsBySiret(docs, establishment.siret));
        const [estabDocs, assoDocs] = await Promise.all([estabDocsPromise, assoDocsPromise]);
        return this._removeDuplicates([...estabDocs, ...assoDocs]) as LabeledDoc[];
    }

    _removeDuplicates(docs: DocumentEntity[] | LabeledDoc[]): DocumentEntity[] | LabeledDoc[] {
        const docsByUrl = {};
        for (const doc of docs) {
            docsByUrl[doc.url] = doc;
        }
        return Object.values(docsByUrl);
    }

    _organizeDocuments(miscDocs: LabeledDoc[]): GroupedDocs {
        const partition = (docs: LabeledDoc[]) => {
            const more: LabeledDoc[] = [];
            const defaultShown: LabeledDoc[] = [];
            for (const doc of docs) (doc.showByDefault ? defaultShown : more).push(doc);
            return { more, defaultShown };
        };

        const fullAssoDocs: LabeledDoc[] = [];
        const fullEstabDocs: LabeledDoc[] = [];
        for (const doc of miscDocs) {
            if (["Le Compte Asso", "Dauphin"].includes(doc.provider)) fullEstabDocs.push(doc);
            if (["RNA", "Avis de Situation Insee"].includes(doc.provider)) fullAssoDocs.push(doc);
            // careful: no default case
        }
        sortLabeledDocs(fullAssoDocs);
        sortLabeledDocs(fullEstabDocs);
        const { defaultShown: assoDocs, more: moreAssoDocs } = partition(fullAssoDocs);
        const { defaultShown: estabDocs, more: moreEstabDocs } = partition(fullEstabDocs);
        return {
            moreAssoDocs,
            moreEstabDocs,
            assoDocs,
            estabDocs,
            someAsso: !!fullAssoDocs.length,
            someEstab: !!fullEstabDocs.length,
            some: !!(assoDocs.length + estabDocs.length),
            fullSome: !!(fullAssoDocs.length + fullEstabDocs.length),
        };
    }

    async onMount() {
        // get documents on mount
        // Svelte component mounted so bind:this replaced this.element with current node element
        await waitElementIsVisible(this.element as HTMLElement);
        const promise = this._getterByType(this.resource).then(docs => this._organizeDocuments(docs));
        this.documentsPromise.set(promise);
    }

    switchDisplay(show: Store<boolean>) {
        show.set(!show.value);
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
