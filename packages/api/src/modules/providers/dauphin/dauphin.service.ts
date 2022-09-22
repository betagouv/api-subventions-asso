import axios from "axios";
import qs from "qs";
import { DemandeSubvention, Rna, Siren, Siret } from "@api-subventions-asso/dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DAUPHIN_USERNAME, DAUPHIN_PASSWORD } from "../../../configurations/apis.conf";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import DauphinSubventionDto from "./dto/DauphinSubventionDto";
import DauphinDtoAdapter from "./adapters/DauphinDtoAdapter"
import dauhpinCachesRepository from "./repositories/dauphinCache.repository";
import configurationsService from "../../configurations/configurations.service";
import { siretToSiren } from "../../../shared/helpers/SirenHelper";
import { formatIntToThreeDigits, formatIntToTwoDigits } from "../../../shared/helpers/StringHelper";


export class DauphinService implements DemandesSubventionsProvider {
    provider = {
        name: "Dauphin",
        type: ProviderEnum.api,
        description: "Dauphin est un système d'information développé par MGDIS permettant aux associations de déposer des demandes de subvention dans le cadre de la politique de la ville et aux services instructeurs d'effectuer de la co-instruction."
    }

    isDemandesSubventionsProvider = true

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        const siren = siretToSiren(siret);
        const lastUpdate = await dauhpinCachesRepository.getLastUpdateBySiren(siren);

        const token = await this.getAuthToken();
        const demandes = await this.getDauphinSubventions(siren, token, lastUpdate);
        await Promise.all(demandes.flat().map(demande => dauhpinCachesRepository.upsert(demande)));
    
        return (await dauhpinCachesRepository.findBySiret(siret)).map((dto => DauphinDtoAdapter.toDemandeSubvention(dto)));
    }
    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        const lastUpdate = await dauhpinCachesRepository.getLastUpdateBySiren(siren);

        const token = await this.getAuthToken();
        const demandes = await this.getDauphinSubventions(siren, token, lastUpdate);
        await Promise.all(demandes.flat().map(demande => dauhpinCachesRepository.upsert(demande)));

        return (await dauhpinCachesRepository.findBySiren(siren)).map((dto => DauphinDtoAdapter.toDemandeSubvention(dto)));
    }

    async getDemandeSubventionByRna(rna: Rna): Promise<DemandeSubvention[] | null> {
        return null;
    }

    async getDemandeSubventionById(id: string): Promise<DemandeSubvention> {
        const token = await this.getAuthToken();

        try {
            const demande = await this.getDauphinSubvention(id, token);
            return DauphinDtoAdapter.toDemandeSubvention(demande);
        } catch (e){
            throw new Error("DemandeSubvention not found");
        }

    }

    private async getDauphinSubventions(siren: Siren, token, lastUpdate ?: Date): Promise<DauphinSubventionDto[]> {
        const result = await axios.post(
            "https://agent-dauphin.cget.gouv.fr/referentiel-financement/api/tenants/cget/demandes-financement/tables/_search",
            this.buildSearchQuery(siren, lastUpdate),
            this.buildSearchHeader(token)
        );

        return result.data.hits.hits.map(h => {
            const source = h._source;

            if ("demandeur" in source) {
                delete source.demandeur.pieces;
                delete source.demandeur.history;
                delete source.demandeur.linkedUsers;
            }

            if ("beneficiaires" in source) {
                source.beneficiaires.forEach(beneficiaire => {
                    delete beneficiaire.pieces;
                    delete beneficiaire.history;
                    delete beneficiaire.linkedUsers;
                })
            }

            return source;
        });
    }

    private async getDauphinSubvention(ref: string, token): Promise<DauphinSubventionDto> {
        const result = await axios.post(
            "https://agent-dauphin.cget.gouv.fr/referentiel-financement/api/tenants/cget/demandes-financement/tables/_search",
            this.buildFindByIdQuery(ref),
            this.buildSearchHeader(token)
        )
        
        return result.data.hits.hits.map(h => h._source)[0];
    }

    private buildSearchQuery(siren: Siren, date ?: Date) {
        return this.buildQuery([
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
            },
            date ? {
                "query":{
                    "query_string":{
                        "query":"date:>" + this.formatDateToDauphinDate(date),
                        "analyze_wildcard":true
                    }
                }
            } : undefined
        ])
    }

    private buildFindByIdQuery(ref: string) {
        return this.buildQuery([{
            "query":{
                "query_string":{
                    "query":"reference:" + ref,
                    "analyze_wildcard": true
                }
            }
        }])
    }

    private buildQuery(searchQuery: unknown[]) {
        return {
            "size": 2000,
            "query": {
                "filtered": {
                    "filter": {
                        "bool": {
                            "must": searchQuery
                        }
                    }
                }
            },
            "_source": [],
            "aggs": {}
        }
    }

    private formatDateToDauphinDate(date: Date): string {
        return `${date.getFullYear()}\\-${formatIntToTwoDigits(date.getMonth() + 1)}\\-${formatIntToTwoDigits(date.getDate())}T${formatIntToTwoDigits(date.getHours())}\\:${formatIntToTwoDigits(date.getMinutes())}\\:${formatIntToTwoDigits(date.getSeconds())}.${formatIntToThreeDigits(date.getMilliseconds())}Z`
    }

    private buildSearchHeader(token) {
        return {
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
    }

    private async getAuthToken() {
        const configToken = await configurationsService.getDauphinToken();
        const tokenAvailableTimeConfig = await configurationsService.getDauphinTokenAvailableTime();
        
        if (
            configToken 
            && tokenAvailableTimeConfig 
            && 
                Date.now() - configToken.updatedAt.getTime() 
                < tokenAvailableTimeConfig.data
        ) return configToken.data;

        const token = await this.sendAuthRequest();

        await configurationsService.setDauphinToken(token);

        return token;
    }

    private sendAuthRequest() {
        const data = qs.stringify({
            username: DAUPHIN_USERNAME,
            password: DAUPHIN_PASSWORD,
            redirectTo: "https://agent-dauphin.cget.gouv.fr/agents/#/cget/home?redirectTo=portal.home",
            captcha: undefined
        })
        
        return axios.post<string>(
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
}

const dauphinService = new DauphinService();

export default dauphinService;