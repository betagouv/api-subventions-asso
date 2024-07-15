import trackerService from "$lib/services/tracker.service";

export class DocumentCardController {
    getDateString(date) {
        if (date.getTime() === 0) return "Date de dépôt non disponible";
        return `Déposé le ${date.toLocaleDateString()}`;
    }

    async onClick(event, doc) {
        trackerService.buttonClickEvent("association-etablissement.documents.download", doc.url);
    }
}
