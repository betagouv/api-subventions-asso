import { IncomingMessage } from "http";
import qs from "qs";
import { CommonApplicationDto, DemandeSubvention, DocumentDto } from "dto";
import * as Sentry from "@sentry/node";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import { DAUPHIN_PASSWORD, DAUPHIN_USERNAME } from "../../../configurations/apis.conf";
import DemandesSubventionsProvider from "../../subventions/@types/DemandesSubventionsProvider";
import configurationsService from "../../configurations/configurations.service";
import { formatIntToTwoDigits } from "../../../shared/helpers/StringHelper";
import { asyncForEach } from "../../../shared/helpers/ArrayHelper";
import DocumentProvider from "../../documents/@types/DocumentsProvider";
import { RawApplication, RawGrant } from "../../grant/@types/rawGrant";
import ProviderCore from "../ProviderCore";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siren from "../../../identifierObjects/Siren";
import GrantProvider from "../../grant/@types/GrantProvider";
import dauphinPort from "../../../dataProviders/db/providers/dauphin/dauphin.port";
import DauphinGisproDbo from "../../../dataProviders/db/providers/dauphin/DauphinGisproDbo";
import DauphinSubventionDto from "./dto/DauphinSubventionDto";
import DauphinDtoAdapter from "./adapters/DauphinDtoAdapter";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";
import dauphinFlatService from "./dauphin.flat.service";

export class DauphinService
    extends ProviderCore
    implements DemandesSubventionsProvider<DauphinGisproDbo>, DocumentProvider, GrantProvider
{
    constructor() {
        super({
            name: "Dauphin",
            type: ProviderEnum.api,
            description:
                "Dauphin est un système d'information développé par MGDIS permettant aux associations de déposer des demandes de subvention dans le cadre de la politique de la ville et aux services instructeurs d'effectuer de la co-instruction.",
            id: "dauphin",
        });
    }

    /**
     * |-------------------------|
     * |   Demande Part          |
     * |-------------------------|
     */

    isDemandesSubventionsProvider = true;
    isDocumentProvider = false; // only while we no longer have access.
    // when we do again, be careful to skip "liste des dirigeants" because of political insecurities

    rawToApplication(rawApplication: RawApplication<DauphinGisproDbo>) {
        return DauphinDtoAdapter.rawToApplication(rawApplication);
    }

    async getDemandeSubvention(id: StructureIdentifier): Promise<DemandeSubvention[]> {
        let applications: DauphinGisproDbo[] = [];
        if (id instanceof EstablishmentIdentifier && id.siret) {
            applications = await dauphinPort.findBySiret(id.siret);
            return applications.map(dto => DauphinDtoAdapter.toDemandeSubvention(dto));
        } else if (id instanceof AssociationIdentifier && id.siren) {
            applications = await dauphinPort.findBySiren(id.siren);
        }

        return applications.map(dto => DauphinDtoAdapter.toDemandeSubvention(dto));
    }

    /**
     * |-------------------------|
     * |   Grant Part            |
     * |-------------------------|
     */

    isGrantProvider = true;

    async getRawGrants(identifier: StructureIdentifier): Promise<RawGrant[]> {
        let entities: DauphinGisproDbo[] = [];
        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            entities = await dauphinPort.findBySiret(identifier.siret);
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            entities = await dauphinPort.findBySiren(identifier.siren);
        }

        // @ts-expect-error: something is broken in Raw Types since #3360 => #3375
        return entities.map(entity => ({
            provider: this.provider.id,
            type: "application",
            data: entity,
            joinKey: entity.gispro?.ej,
        }));
    }

    rawToCommon(rawGrant: RawGrant): CommonApplicationDto {
        // @ts-expect-error: something is broken in Raw Types since #3360 => #3375
        return DauphinDtoAdapter.toCommon(rawGrant.data as DauphinGisproDbo);
    }

    /**
     * |-------------------------|
     * |   Caching Part          |
     * |-------------------------|
     */

    async updateApplicationCache() {
        const lastUpdateDate = await dauphinPort.getLastImportDate();
        console.log(`update cache from ${lastUpdateDate.toString()}`);
        const token = await this.getAuthToken();
        let totalToFetch = 0;
        let fetched = 0;
        do {
            try {
                if (fetched == 0) console.log("start fetching data...");
                else console.log(`fetching data from ${fetched}`);
                const result = (
                    await this.http.post(
                        "https://agent-dauphin.cget.gouv.fr/referentiel-financement/api/tenants/cget/demandes-financement/tables/_search",
                        { ...this.buildFetchApplicationFromDateQuery(lastUpdateDate), from: fetched },
                        this.buildSearchHeader(token),
                    )
                ).data;

                // @ts-expect-error: #3360 any replaced by unknown : make a type
                if (!result || !result.hits) break;

                // @ts-expect-error: #3360 any replaced by unknown : make a type
                const applications = result.hits.hits;
                fetched += applications.length;

                if (totalToFetch === 0) {
                    // @ts-expect-error: #3360 any replaced by unknown : make a type
                    totalToFetch = result.hits.total;
                    console.log(`found ${totalToFetch} applications to be fetched`);
                }

                if (!applications) {
                    throw new Error("Something went wrong with dauphin results");
                }

                const updateDate = new Date();
                await this.saveApplicationsInCache(
                    applications.map(entity => this.formatAndReturnApplicationDto(entity, updateDate)),
                );

                console.log(`fetched ${applications.length} applications`);
            } catch (e) {
                Sentry.captureException(e);
                console.error(e);
                return [];
            }
        } while (fetched < totalToFetch);
        await dauphinFlatService.feedApplicationFlat();
    }

    private saveApplicationsInCache(applications: DauphinSubventionDto[]) {
        return asyncForEach(applications, async application => {
            await dauphinPort.upsert({ dauphin: application });
        });
    }

    private buildFetchApplicationFromDateQuery(date) {
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

    private formatAndReturnApplicationDto(hit, updateDate: Date) {
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
        source.codeActionProjet = source.referenceAdministrative.match(/(?:DA)?(\d{8})(?:-\d*)?/)?.[1];
        source.updateDate = updateDate;

        return source as DauphinSubventionDto;
    }

    migrateDauphinCacheToDauphin(logger) {
        return dauphinPort.migrateDauphinCacheToDauphin(logger);
    }

    // Documents

    // no RIB document in dauphin

    async getDocuments(identifier: StructureIdentifier): Promise<DocumentDto[]> {
        if (identifier instanceof AssociationIdentifier && !identifier.siren) {
            return [];
        }

        let siren: Siren;

        if (identifier instanceof EstablishmentIdentifier && identifier.siret) {
            siren = identifier.siret.toSiren();
        } else if (identifier instanceof AssociationIdentifier && identifier.siren) {
            siren = identifier.siren;
        } else {
            return [];
        }

        /*
            the only way to get documents through dauphin API is to get them through their internal dauphin ID.
            Because of that, we need a preliminary request to dauphin to get their internal id. cf issue #1004
        */
        const dauphinInternalId = await this.findDauphinInternalId(siren);
        if (!dauphinInternalId) return [];

        const token = await this.getAuthToken();
        // @ts-expect-error: #3360 any replaced by unknown : make a type
        const result = (
            await this.http.get(
                `https://agent-dauphin.cget.gouv.fr/referentiel-tiers/cget/tiers/${dauphinInternalId}?expand=pieces.documents`,
                this.buildSearchHeader(token),
            )
        ).data.pieces;

        return DauphinDtoAdapter.toDocuments(result);
    }

    private async findDauphinInternalId(siren: Siren): Promise<string | undefined> {
        const query = {
            from: 0,
            size: 1,
            type: "tiers",
            query: siren.value,
            facets: {
                famille: ["Association"],
                status: ["SUPPORTED"],
            },
        };
        const token = await this.getAuthToken();

        const res = (
            await this.http.post(
                "https://agent-dauphin.cget.gouv.fr/referentiel-tiers/cget/tiers/search/fullText",
                query,
                this.buildSearchHeader(token),
            )
        ).data;
        // @ts-expect-error: #3360 any replaced by unknown : make a type
        const properHit = res?.hits?.hits?.find(asso => asso._source.SIREN === siren.value);
        return properHit?._id?.match(/cget-(.*)/)?.[1];
    }

    async getSpecificDocumentStream(docUrl: string): Promise<IncomingMessage> {
        const token = await this.getAuthToken();
        // @ts-expect-error: #3360 any replaced by unknown : make a type
        return (
            await this.http.get(docUrl, {
                responseType: "stream",
                headers: {
                    accept: "application/json, text/plain, */*, application/vnd.mgdis.tiers-3.19.0+json",
                    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                    authorization: "Bearer " + token,
                    "mg-authentication": "true",
                    Referer: "https://agent-dauphin.cget.gouv.fr/referentiel-financement/public/",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
            })
        ).data;
    }

    // General

    private toDauphinDateString(date: Date) {
        const year = date.getFullYear();
        const month = formatIntToTwoDigits(date.getMonth() + 1);
        const day = formatIntToTwoDigits(date.getDate());
        return `${year}-${month}-${day}`;
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

        return this.http
            .post<string>("https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/tokens", data, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/x-www-form-urlencoded",
                    Referer: "https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/ux/",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
            })
            .then(result => {
                return result.data;
            });
    }
}

const dauphinService = new DauphinService();

export default dauphinService;
