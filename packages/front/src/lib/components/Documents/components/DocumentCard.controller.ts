import { nanoid } from "nanoid";
import trackerService from "$lib/services/tracker.service";
import Store from "$lib/core/Store";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export class DocumentCardController {
    public isSelected: Store<boolean>;
    public checkBoxId: string;
    private document: DocumentEntity;

    constructor(document: DocumentEntity) {
        this.isSelected = new Store(false);
        this.checkBoxId = nanoid(16);
        this.document = document;
    }

    getDateString(date) {
        if (date.getTime() === 0) return "Date de dépôt non disponible";
        return `Déposé le ${date.toLocaleDateString()}`;
    }

    async onClick(event, doc) {
        trackerService.buttonClickEvent("association-etablissement.documents.download", doc.url);
    }

    get documentLabel() {
        if (this.document.__meta__.siret) return `${this.document.label} - ${this.document.__meta__.siret}`;
        return this.document.label;
    }

    newValueOnCheck() {
        return this.isSelected.value ? undefined : this.document;
    }
}
