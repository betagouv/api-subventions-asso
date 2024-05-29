import { getSiegeSiret } from "$lib/resources/associations/association.helper";
import Store from "$lib/core/Store";
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
    association: "Pièces complémentaires déposées par le siège social (via Le Compte Asso ou Dauphin)",
    establishment: "Pièces complémentaires déposées par l'établissement (via Le Compte Asso ou Dauphin)",
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

    constructor(
        public resourceType: ResourceType,
        // TODO: replace unknown with EstablishmentEntity when created
        public resource: AssociationEntity | unknown,
    ) {
        this.resourceType = resourceType;
        this.documentsPromise = new Store(returnInfinitePromise());
        this.zipPromise = new Store(Promise.resolve(null));
        this.resource = resource;
        this.showMoreAsso = new Store(false);
        this.showMoreEstab = new Store(false);
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
        return documentService.labelAssoDocsBySiret(associationDocuments, getSiegeSiret(association));
    }

    _removeDuplicates(docs: DocumentEntity[] | LabeledDoc[]): DocumentEntity[] | LabeledDoc[] {
        const docsByUrl = {};
        for (const doc of docs) {
            docsByUrl[doc.url] = doc;
        }
        return Object.values(docsByUrl);
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
            // TODO where to put eventual others?
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
        // Svelte component mounted so bind:this replaced this.element with current node element
        await waitElementIsVisible(this.element as HTMLElement);
        const promise = this._getterByType(this.resource).then(docs => this._organizeDocuments(docs));
        this.documentsPromise.set(promise);
    }

    async downloadAll() {
        // @ts-expect-error -- missing type
        const identifier = this.resource?.rna || this.resource?.siren || this.resource?.siret;
        const promise = documentService
            .getAllDocs(identifier)
            .then(blob => documentHelper.download(blob, `documents_${identifier}.zip`));
        setTimeout(() => {
            this.zipPromise.set(promise);
        }, 750); // weird if message appears and leaves right ahead ; quite arbitrary value
        await promise;
    }

    switchDisplay(show: Store<boolean>) {
        show.set(!show.value);
    }
}
