import axios from "axios";
import qs from "qs";
import { DemandeSubvention, Siren, Siret } from "@api-subventions-asso/dto";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DAUPHIN_USERNAME, DAUPHIN_PASSWORD } from "../../../configurations/apis.conf";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import configurationsService from "../../configurations/configurations.service";
import Gispro from "../gispro/@types/Gispro";
import { formatIntToTwoDigits } from "../../../shared/helpers/StringHelper";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import DauphinSubventionDto from "./dto/DauphinSubventionDto";
import DauphinDtoAdapter from "./adapters/DauphinDtoAdapter";
import dauhpinGisproRepository from "./repositories/dauphin-gispro.repository";

export class DauphinService implements DemandesSubventionsProvider {
    provider = {
        name: "Dauphin",
        type: ProviderEnum.api,
        description:
            "Dauphin est un système d'information développé par MGDIS permettant aux associations de déposer des demandes de subvention dans le cadre de la politique de la ville et aux services instructeurs d'effectuer de la co-instruction.",
    };

    isDemandesSubventionsProvider = true;

    async getDemandeSubventionBySiret(siret: Siret): Promise<DemandeSubvention[] | null> {
        const applications = await dauhpinGisproRepository.findBySiret(siret);
        return applications.map(dto => DauphinDtoAdapter.toDemandeSubvention(dto));
    }

    async getDemandeSubventionBySiren(siren: Siren): Promise<DemandeSubvention[] | null> {
        const applications = await dauhpinGisproRepository.findBySiren(siren);
        return applications.map(dto => DauphinDtoAdapter.toDemandeSubvention(dto));
    }

    async getDemandeSubventionByRna(): Promise<DemandeSubvention[] | null> {
        return null;
    }

    async fetchAndSaveApplicationsFromDate(date) {
        try {
            const token = await this.getAuthToken();
            await this.persistApplicationsFromDate(token, date);
        } catch (e) {
            console.error(e);
        }
    }

    private async persistApplicationsFromDate(token, date: Date) {
        let totalToFetch = 0;
        let fetched = 0;
        do {
            try {
                console.log(`start fetching data from ${fetched}`);
                const result = (
                    await axios.post(
                        "https://agent-dauphin.cget.gouv.fr/referentiel-financement/api/tenants/cget/demandes-financement/tables/_search",
                        { ...this.buildFetchFromDateQuery(date), from: fetched },
                        this.buildSearchHeader(token),
                    )
                ).data;

                if (!result || !result.hits) break;

                const applications = result.hits.hits;
                fetched += applications.length;

                if (totalToFetch === 0) totalToFetch = result.hits.total;

                if (!applications) {
                    throw new Error("Something went wrong with dauphin results");
                }

                await this.saveApplicationsInCache(applications.map(this.formatAndReturnDto));

                console.log(`fetched ${applications.length} applications`);
            } catch (e) {
                console.error(e);
                return [];
            }
        } while (fetched < totalToFetch);
        return Promise.resolve();
    }

    private saveApplicationsInCache(applications: DauphinSubventionDto[]) {
        return asyncForEach(applications, async application => {
            await dauhpinGisproRepository.upsert({ dauphin: application });
        });
    }

    private formatAndReturnDto(hit) {
        const source = hit._source;

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
            });
        }

        return source as DauphinSubventionDto;
    }

    private toDauphinDateString(date: Date) {
        const year = date.getFullYear();
        const month = formatIntToTwoDigits(date.getMonth() + 1);
        const day = formatIntToTwoDigits(date.getDate());
        return `${year}-${month}-${day}`;
    }

    private buildFetchFromDateQuery(date) {
        return {
            size: 1000,
            sort: [{ date: { order: "desc", missing: "_last", mode: "max" } }],
            query: {
                filtered: {
                    filter: {
                        bool: {
                            must: [
                                {
                                    query: {
                                        query_string: {
                                            query: "demandeur.famille.href:\\/referentiel\\-tiers\\/cget\\/familles\\/75",
                                            analyze_wildcard: true,
                                        },
                                    },
                                },
                                {
                                    bool: {
                                        must: [
                                            {
                                                query: {
                                                    range: {
                                                        date: {
                                                            gte: this.toDauphinDateString(date),
                                                            time_zone: "+2:00",
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
            inner_hits: {},
            _source: [],
            aggs: {},
        };
    }

    private buildSearchHeader(token) {
        return {
            headers: {
                accept: "application/json, text/plain, */*,application/vnd.mgdis.tiers-3.19.0+json",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                authorization: "Bearer " + token,
                "content-type": "application/json;charset=UTF-8",
                "mg-authentication": "true",
                Referer: "https://agent-dauphin.cget.gouv.fr/referentiel-financement/public/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
        };
    }

    private async getAuthToken() {
        const configToken = await configurationsService.getDauphinToken();
        const tokenAvailableTimeConfig = await configurationsService.getDauphinTokenAvailableTime();

        if (
            configToken &&
            tokenAvailableTimeConfig &&
            Date.now() - configToken.updatedAt.getTime() < tokenAvailableTimeConfig.data
        )
            return configToken.data;

        const token = await this.sendAuthRequest();

        await configurationsService.setDauphinToken(token);

        return token;
    }

    private sendAuthRequest() {
        const data = qs.stringify({
            username: DAUPHIN_USERNAME,
            password: DAUPHIN_PASSWORD,
            redirectTo: "https://agent-dauphin.cget.gouv.fr/agents/#/cget/home?redirectTo=portal.home",
            captcha: undefined,
        });

        return axios
            .post<string>("https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/tokens", data, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/x-www-form-urlencoded",
                    Referer: "https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/ux/",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
            })
            .then(reslut => {
                return reslut.data;
            });
    }

    async insertGisproEntity(gisproEntity: Gispro) {
        const entity = await dauhpinGisproRepository.findOneByDauphinId(gisproEntity.dauphinId);

        if (!entity) return;

        entity.gispro = gisproEntity;
        await dauhpinGisproRepository.upsert(entity);
    }

    migrateDauphinCacheToDauphinGispro(logger) {
        return dauhpinGisproRepository.migrateDauphinCacheToDauphinGispro(logger);
    }
}

const dauphinService = new DauphinService();

export default dauphinService;
