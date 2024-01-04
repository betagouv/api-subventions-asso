import documentPort from "./documents.port";
import { DATASUB_URL } from "$env/static/public";
import authService from "$lib/resources/auth/auth.service";

export class DocumentService {
    getDauphinBlob(localDauphinDocUrl) {
        return documentPort.getDauphinBlob(localDauphinDocUrl);
    }

    isInternalLink(link) {
        const isAbsoluteUrl = new RegExp("^(?:[a-z+]+:)?//", "i");
        return !isAbsoluteUrl.test(link);
    }

    async formatAndSortDocuments(documents) {
        const documentLabels = {
            RIB: "RIB",
            "Avis Situation Insee": "Avis de situation (INSEE)",
            MD: "Récépissé de modification",
            LDC: "Liste des dirigeants",
            PV: "Procès verbal",
            STC: "Statuts",
            RAR: "Rapport d'activité",
            RAF: "Rapport financier",
            BPA: "Budget prévisionnel annuel",
            RCA: "Rapport du commissaire aux compte",
            "Education nationale": `Agrément Education Nationale`,
            "Jeunesse et Education Populaire (JEP)": `Agrément jeunesse et éducation populaire`,
            Formation: "L'habilitation d'organisme de formation",
        };

        const compareLabelledDocs = (docA, docB) => {
            // lexicographic order by type label then date
            if (docA.type !== docB.type) return docA.label.localeCompare(docB.label);
            return docA.date.getTime() - docB.date.getTime();
        };

        const sortedDocs = documents
            .filter(doc => doc.type && doc.type !== "LDC") // skip "Liste des dirigeants" because of political insecurities
            .map(doc => ({ ...doc, label: documentLabels[document.type] || document.type }))
            .sort(compareLabelledDocs);

        // internal link : add api domain and token
        const token = (await authService.getCurrentUser()).jwt.token;
        return sortedDocs.map(doc => this.addTokenToInternalLink(token, doc));
    }

    addTokenToInternalLink(token, doc) {
        if (this.isInternalLink(doc.url)) doc.url = `${DATASUB_URL}${doc.url}?token=${token}`;
        return doc;
    }
}

const documentService = new DocumentService();

export default documentService;
