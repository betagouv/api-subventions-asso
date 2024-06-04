import trackerService from "$lib/services/tracker.service";
import Store from "$lib/core/Store";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export class DocumentCardController {
    public isSelected: Store<boolean>;
    public checkBoxId: string;

    constructor(document: DocumentEntity) {
        this.isSelected = new Store(false);
        this.checkBoxId = document.nom + document.date;
    }

    getDateString(date) {
        if (date.getTime() === 0) return "Date de dépôt non disponible";
        return `Déposé le ${date.toLocaleDateString()}`;
    }

    async onClick(event, doc) {
        trackerService.buttonClickEvent("association-etablissement.documents.download", doc.url);
    }
}
