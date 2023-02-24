import { DemandeSubvention, Rna, Siren, Siret } from "@api-subventions-asso/dto";
import dedent from "dedent";
import axios from "axios";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DEMARCHES_SIMPLIFIEES_TOKEN } from "../../../configurations/apis.conf";

export class DemarchesSimplifieesService implements DemandesSubventionsProvider {
    isDemandesSubventionsProvider = true;
    provider = {
        name: "Démarches Simplifiées",
        type: ProviderEnum.api,
        description: "" // TODO
    };

    getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return Promise.resolve(null);
    }

    getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        return Promise.resolve(null);
    }

    getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return Promise.resolve(null);
    }

    async firstQuery(processId = 52961) {
        const query = dedent`query getDemarche($demarcheNumber: Int!) { 
            demarche(number: $demarcheNumber) { 
                id dossiers { 
                     nodes { 
                        id demandeur { 
                            ... on PersonnePhysique { civilite nom prenom }
                            ... on PersonneMorale { siret } 
                        }
                    }
                } 
            } 
        }`;
        try {
            const result = await axios.post(
                "https://www.demarches-simplifiees.fr/api/v2/graphql",
                {
                    query,
                    variables: {
                        demarcheNumber: processId
                    }
                },
                this.buildSearchHeader(DEMARCHES_SIMPLIFIEES_TOKEN)
            );

            return result.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    private buildSearchHeader(token) {
        return {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                authorization: "Bearer " + token,
                "content-type": "application/json;charset=UTF-8",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        };
    }
}

const demarchesSimplifieesService = new DemarchesSimplifieesService();

export default demarchesSimplifieesService;
