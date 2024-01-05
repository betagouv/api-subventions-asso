import documentPort from "./documents.port";
import { DATASUB_URL } from "$env/static/public";
import authService from "$lib/resources/auth/auth.service";

export class DocumentService {
    getBlob(localDocUrl) {
        return documentPort.getBlob(localDocUrl);
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
            .map(doc => ({ ...doc, label: documentLabels[doc.type] || doc.type }))
            .sort(compareLabelledDocs);

        // proxy link : add api domain and token
        const token = (await authService.getCurrentUser()).jwt.token;
        return sortedDocs.map(doc => ({ ...doc, url: `${DATASUB_URL}${doc.url}&token=${token}` }));
    }
}

const documentService = new DocumentService();

export default documentService;
