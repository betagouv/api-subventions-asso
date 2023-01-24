// Voir si il ne vaux mieux pas passer ça en adapteur
import axios from "axios";
import { flatenProviderValue } from "../../helpers/providerValueHelper";
import SSEConnector from "../../core/SseConnector";
import Store from "../../core/Store";

class SubventionsPort {
    _getSubventionsConnectedStore(identifier, type) {
        const path = `/sse/${type}/${identifier}/subventions`;
        const connector = new SSEConnector(path);
        const store = new Store({
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
                store.update(state => ({
                    ...state,
                    __meta__: {
                        ...state.__meta__,
                        providerCalls: data.__meta__.totalProviders
                    }
                }));
            } else if (data.subventions) {
                store.update(state => ({
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
            store.update(state => {
                return {
                    ...state,
                    status: "close"
                };
            });
        });

        connector.on("error", async error => {
            console.warn("Flux as probably locked :", error, "Check with HTTPs request");
            const subventions = await this._getSubventionByHttp(type, identifier);
            store.update(state => ({
                status: "close",
                subventions: state.subventions.concat(subventions.map(d => flatenProviderValue(d))),
                __meta__: {
                    providerCalls: 1,
                    providerAnswers: 1
                }
            }));
        });

        return store;
    }

    _getSubventionByHttp(type, identifier) {
        const pathHttp = `/${type}/${identifier}/subventions`;
        return axios.get(pathHttp).then(result => {
            if (!result.data) return [];
            return result.data.subventions;
        });
    }

    getAssociationSubventionsStore(identifier) {
        return this._getSubventionsConnectedStore(identifier, "association");
    }

    getEtablissementSubventionsStore(identifier) {
        return this._getSubventionsConnectedStore(identifier, "etablissement");
    }
}

const subventionsPort = new SubventionsPort();

export default subventionsPort;
