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
            RIB: "Télécharger le RIB",
            "Avis Situation Insee": "Télécharger l'avis de situation (INSEE)",
            MD: "Télécharger le Récépissé de modification",
            LDC: "Télécharger la liste des dirigeants",
            PV: "Télécharger le Procès verbal",
            STC: "Télécharger les Statuts",
            RAR: "Télécharger le Rapport d'activité",
            RAF: "Télécharger le Rapport financier",
            BPA: "Télécharger le Budget prévisionnel annuel",
            RCA: "Télécharger le Rapport du commissaire aux compte",
            "Education nationale": `Télécharger "L'agrément Education Nationale"`,
            "Jeunesse et Education Populaire (JEP)": `Télécharger "L'agrément jeunesse et éducation populaire"`,
            Formation: `Télécharger "L'habilitation d'organisme de formation"`,
        };

        // label documents
        const documentsByType = documents.reduce((acc, document) => {
            if (!acc[document.type]) acc[document.type] = [];

            acc[document.type].push({
                ...document,
                label: documentLabels[document.type] || document.type,
            });

            return acc;
        }, {});

        // sort
        const sortedFlatDocs = Object.entries(documentsByType)
            .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1)) // Sort by type
            .map(
                ([__key__, documents]) => documents.sort((a, b) => b.date.getTime() - a.date.getTime()), // In same types sort by date
            )
            .flat();

        // internal link : add api domain and token
        const token = (await authService.getCurrentUser()).jwt.token;
        return sortedFlatDocs.map(doc => {
            if (this.isInternalLink(doc.url)) doc.url = `${DATASUB_URL}${doc.url}?token=${token}`;
            return doc;
        });
    }
}

const documentService = new DocumentService();

export default documentService;
