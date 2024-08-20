import { derived, ReadStore } from "$lib/core/Store";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export default class DownloadButtonController {
    public downloadBtnLabel: ReadStore<string>;

    constructor(selectDocsStore: ReadStore<DocumentEntity[]>) {
        this.downloadBtnLabel = derived(selectDocsStore, docs =>
            docs.length ? `Télécharger la sélection (${docs.length})` : "Tout télécharger",
        );
    }
}
