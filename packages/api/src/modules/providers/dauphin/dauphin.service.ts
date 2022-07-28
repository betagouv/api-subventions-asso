import axios from "axios";
import qs from "qs";
import { DemandeSubvention, Rna, Siren, Siret } from "@api-subventions-asso/dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DAUPHIN_EMAIL, DAUPHIN_PASSWORD } from "../../../configurations/apis.conf";
import ProviderValueFactory from "../../../shared/ProviderValueFactory";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";

export class DauphinService implements DemandesSubventionsProvider {
    provider = {
        name: "Dauphin",
        type: ProviderEnum.api,
        description: "Loreipsum"
    }

    isDemandesSubventionsProvider = true

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        return null;
    }
    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        function getAuthToken() {
            const data = qs.stringify({
                username: DAUPHIN_EMAIL,
                password: DAUPHIN_PASSWORD,
                redirectTo: "https://agent-dauphin.cget.gouv.fr/agents/#/cget/home?redirectTo=portal.home",
                captcha: undefined
            })
            
            return axios.post(
                "https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/tokens",
                data,
                {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                        "content-type": "application/x-www-form-urlencoded",
                        "Referer": "https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/ux/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    }
                }
            ).then(reslut => {
                return reslut.data;
            })
        }

        function getMontantDemande(demande) {
            return demande.planFinancement.find(pf => pf.current).recette.postes.map(p => p?.sousPostes?.map(s => s?.lignes?.map(l => l.dispositifEligible ? l.montant.ht : undefined))).flat(2).filter(a => a)[0]
        }
        function getMontantAccorder(demande) {
            return demande.planFinancement.map(pf => pf.recette.postes.map(p => p?.sousPostes?.map(s => s?.lignes?.map(l => l.financement?.montantVote?.ht)))).flat(3).filter(a => a)[0];
        }
        
        async function searchDemandeByTier(siren, token) {
            const result = await axios.post(
                "https://agent-dauphin.cget.gouv.fr/referentiel-financement/api/tenants/cget/demandes-financement/tables/_search",
                {
                    "size": 2000,
                    "query": {
                        "filtered": {
                            "filter": {
                                "bool": {
                                    "must": [
                                        {
                                            "bool": {
                                                "should":[ {
                                                    "nested": {
                                                        "path": "beneficiaires",
                                                        "filter": {
                                                            "bool": {
                                                                "should": [
                                                                    {
                                                                        "query": {
                                                                            "query_string": {
                                                                                "query": "beneficiaires.SIRET.SIREN:" + siren,
                                                                                "analyze_wildcard": true
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }],
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "_source": [],
                    "aggs": {}
                },
                {
                    "headers": {
                        "accept": "application/json, text/plain, */*,application/vnd.mgdis.tiers-3.19.0+json",
                        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                        "authorization": "Bearer " + token,
                        "content-type": "application/json;charset=UTF-8",
                        "mg-authentication": "true",
                        "Referer": "https://agent-dauphin.cget.gouv.fr/referentiel-financement/public/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                }
            )
            
            return result.data.hits.hits.map(h => h._source);
        }
        
        const token = await getAuthToken();
        const demandes = await searchDemandeByTier(siren, token); //await Promise.all(tiers.map(t => searchDemandeByTier(t, token)));
    
        const formatedDemandes = demandes.flat().map(demande => {
            const montantDemande = getMontantDemande(demande);
    
            const montantAccorde = getMontantAccorder(demande);
            return {
                title: demande.intituleProjet,
                description: (demande.description || { value: demande.virtualStatusLabel }).value,
                date: new Date(demande.dateDemande),
                year: demande.exerciceBudgetaire,
                service: (demande?.financeursPrivilegies || [{title: ""}])[0].title || "",
                dispositif: demande?.dispositif?.title,
                montantDemande,
                montantAccorde,
                status: demande.status,
                siret: demande.demandeur.SIRET.complet
            }
        });
        return formatedDemandes.map(data => {
            const toPV = ProviderValueFactory.buildProviderValueAdapter("Dauphin", data.date)

            return {
                siret: toPV(data.siret),
                service_instructeur: toPV(data.service),
                dispositif: toPV(data.dispositif || ''),
                status: toPV(data.status),
                date_commision: toPV(data.date),
                annee_demande: toPV(data.year),
                montants: {
                    demande: data.montantDemande ? toPV(data.montantDemande) : undefined,
                    accorde: data.montantAccorde ? toPV(data.montantAccorde) : undefined,
                },
                actions_proposee: [
                    {
                        intitule: toPV(data.title),
                        objectifs: toPV(data.description),
                    }
                ]
            }
        })
    }
    async getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return null;
    }
    async getDemandeSubventionById(id: string): Promise<DemandeSubvention> {
        throw new Error("Pouet");
    }
}

const dauphinService = new DauphinService();

export default dauphinService;