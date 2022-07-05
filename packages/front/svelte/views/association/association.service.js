import axios from "axios";
import { toAssociationView, toEtablissementComponent, toDocumentComponent } from "./association.adapter";

export class AssociationService {
    async getAssociation(id) {
        const path = `/association/${id}`;
        return axios.get(path).then((result) => {
            return toAssociationView(result.data.association);
        });
    }

    async getEtablissements(associationIdentifier) {
        const path = `/association/${associationIdentifier}/etablissements`;
        return axios.get(path).then((result) => {
            return result.data.etablissements.map(etablissement => toEtablissementComponent(etablissement))
        });
    }

    async getDocuments(associationIdentifier) {
        const path = `/association/${associationIdentifier}/documents`;
        const documentLabels = {
            "RIB": "Télécharger le RIB",
            "Avis Situation Insee": "Télécharger l'avis de situation (INSEE)",
            "MD": "Télécharger le 'Récépissé de modification'", 
            "LDC": "Télécharger la liste des dirigeants",
            "PV": "Télécharger le `Procès verbal`",
            "STC": "Télécharger les `Statuts`",
            "RAR": "Télécharger le `Rapport d'activité`",
            "RAF": "Télécharger le `Rapport financier`",
            "BPA": "Télécharger le `Budget prévisionnel annuel`",
            "RCA": "Télécharger le `Rapport du commissaire aux compte`",
            "Education nationale": "Télécharger `L'agrément Education Nationale`",
            "Jeunesse et Education Populaire (JEP)": "Télécharger `L'agrément jeunesse et éducation populaire`",
            "Formation": "Télécharger `L'habilitation d'organisme de formation`",
        }
        const result = await axios.get(path);
        const documents = result.data.documents.map(document => toDocumentComponent(document));

        const documentsByType = documents.reduce((acc, document) => {
            if (!acc[document.type]) acc[document.type] = [];

            acc[document.type].push({
                ...document,
                label: documentLabels[document.type] || document.type
            });

            return acc;
        }, {});

        const sortByType = (typeA, typeB, index) => {
            if (index >= typeA.length && index >= typeB.length) return 0;
            if (index >= typeA.length) return -1;
            if (index >= typeB.length) return 1;

            const result = typeA.charCodeAt(index) - typeB.charCodeAt(index);

            if (result != 0) return result;
            return sortByType(typeA, typeB, index + 1);
        }

        return Object.entries(documentsByType)
            .sort(([keyA], [keyB]) => sortByType(keyA, keyB, 0)) // Sort by type 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([__key__, documents]) => documents
                .sort((a, b) => b.date.getTime() - a.date.getTime()) // In same type sort by date
            ).flat()
    }
}

const associationService = new AssociationService();

export default associationService;
