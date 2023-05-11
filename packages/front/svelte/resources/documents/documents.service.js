import axios from "axios";
import { getObjectWithMetadata } from "@helpers/providerValueHelper";

export const toDocumentComponent = getObjectWithMetadata;

class DocumentService {
    async getDocuments(path) {
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
        const result = await axios.get(path);
        const documents = result.data.documents.map(document => toDocumentComponent(document));

        const documentsByType = documents.reduce((acc, document) => {
            if (!acc[document.type]) acc[document.type] = [];

            acc[document.type].push({
                ...document,
                label: documentLabels[document.type] || document.type,
            });

            return acc;
        }, {});

        return (
            Object.entries(documentsByType)
                .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1)) // Sort by type
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ([__key__, documents]) => documents.sort((a, b) => b.date.getTime() - a.date.getTime()), // In same type sort by date
                )
                .flat()
        );
    }
}

const documentService = new DocumentService();

export default documentService;
