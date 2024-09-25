import { PUBLIC_DATASUB_URL } from "$env/static/public";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

export class DocumentHelper {
    formatAndSortDocuments(documents): DocumentEntity[] {
        const documentLabels = {
            RIB: "RIB",
            "Avis Situation Insee": "Avis de situation (INSEE)",
            MD: "Récépissé de modification",
            CR: "Récépissé de création",
            LDC: "Liste des dirigeants",
            PV: "Procès verbal",
            STC: "Statuts",
            RAR: "Rapport d'activité",
            RFA: "Rapport financier",
            BPA: "Budget prévisionnel annuel",
            RCA: "Rapport du commissaire aux comptes",
            "Education nationale": `Agrément Education Nationale`,
            "Jeunesse et Education Populaire (JEP)": `Agrément jeunesse et éducation populaire`,
            Formation: "L'habilitation d'organisme de formation",
            "Service Civique": "Agrément service civique",
            AGR: "Arrêté d'agrément",
            AFF: "Attestation d’affiliation",
            PRS: "Projet associatif",
        };

        const compareLabelledDocs = (docA, docB) => {
            // lexicographic order by type label then date
            if (docA.type !== docB.type) return docA.label.localeCompare(docB.label);
            return docA.date.getTime() - docB.date.getTime();
        };

        const sortedDocs = documents
            .map(doc => ({ ...doc, label: documentLabels[doc.type] || doc.type }))
            .sort(compareLabelledDocs);

        return sortedDocs.map(doc => ({ ...doc, url: `${PUBLIC_DATASUB_URL}${doc.url}` }));
    }

    download(blob: Blob, fileName: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }
}

const documentHelper = new DocumentHelper();

export default documentHelper;
