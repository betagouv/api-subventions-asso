import axios from "axios";
import { writable } from "svelte/store";

import { updateSearchHistory } from "../../services/storage.service";
import { flatenProviderValue } from "../../helpers/providerValueHelper";
import SSEConnector from "../../shared/SseConnector";
import { toAssociationView, toEtablissementComponent } from "./association.adapter";
import documentService from "../../services/document.service";

export class AssociationService {
    basePath = "/association/";

    connectSubventionsFlux(associationIdentifier) {
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
        return documentService.getDocuments(`/association/${identifier}/documents`);
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
