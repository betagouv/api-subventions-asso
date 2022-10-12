import axios from "axios";
import { writable } from "svelte/store";

import { updateSearchHistory } from "../../services/storage.service";
import { flatenProviderValue } from "../../helpers/dataHelper";
import SSEConnector from "../../shared/SseConnector";
import { toAssociationView, toEtablissementComponent, toDocumentComponent } from "./association.adapter";

export class AssociationService {
    basePath = "/association/";

    connectSuventionsFlux(associationIdentifier) {
        const path = `/sse${this.basePath}${associationIdentifier}/subventions`;
        const connector = new SSEConnector(path);
        const flux = writable({
            status: "inProgress",
            subventions: [],
            __meta__: {
                providerCalls: 0,
                providerAnswers: 0
            }
        });

        connector.on("data", data => {
            // first message event
            if (!data.subventions && data.__meta__?.totalProviders) {
                flux.update(state => ({
                    ...state,
                    __meta__: {
                        ...state.__meta__,
                        providerCalls: data.__meta__.totalProviders
                    }
                }));
            } else if (data.subventions) {
                flux.update(state => ({
                    ...state,
                    subventions: state.subventions.concat(data.subventions.map(d => flatenProviderValue(d))),
                    __meta__: {
                        ...state.__meta__,
                        providerAnswers: state.__meta__.providerAnswers + 1
                    }
                }));
            }
        });

        connector.on("close", () => {
            flux.update(state => {
                return {
                    ...state,
                    status: "close"
                };
            });
        });

        return flux;
    }

    async getAssociation(id) {
        const path = `/association/${id}`;
        return axios.get(path).then(result => {
            const association = toAssociationView(result.data.association);
            updateSearchHistory({
                rna: association.rna,
                siren: association.siren,
                name: association.denomination_rna || association.denomination_siren,
                objectSocial: association.objet_social || ""
            });
            return association;
        });
    }

    async getEtablissements(associationIdentifier) {
        const path = `/association/${associationIdentifier}/etablissements`;
        return axios.get(path).then(result => {
            return result.data.etablissements.map(etablissement => toEtablissementComponent(etablissement));
        });
    }

    async getDocuments(identifier) {
        const path = `/association/${identifier}/documents`;
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
            Formation: `Télécharger "L'habilitation d'organisme de formation"`
        };
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

        return (
            Object.entries(documentsByType)
                .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1)) // Sort by type
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(
                    ([__key__, documents]) => documents.sort((a, b) => b.date.getTime() - a.date.getTime()) // In same type sort by date
                )
                .flat()
        );
    }

    async getSubventions(associationIdentifier) {
        const path = `${this.basePath}${associationIdentifier}/subventions`;
        return axios
            .get(path)
            .then(result => {
                return result.data.subventions.map(subvention => flatenProviderValue(subvention));
            })
            .catch(e => {
                if (e.request.status == 404) return [];
                return e;
            });
    }

    async getVersements(associationIdentifier) {
        const path = `${this.basePath}${associationIdentifier}/versements`;
        return axios
            .get(path)
            .then(result => {
                return result.data.versements.map(versement => flatenProviderValue(versement));
            })
            .catch(e => {
                if (e.request.status == 404) return [];
                return e;
            });
    }

    async getProviders() {
        const path = "/open-data/providers";

        return axios.get(path).then(result => {
            if (result.data) return result.data;
            return result;
        });
    }
}

const associationService = new AssociationService();

export default associationService;
