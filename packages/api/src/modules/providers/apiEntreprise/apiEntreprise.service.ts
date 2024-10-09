import { AxiosError } from "axios";
import qs from "qs";

import { Association, Siren, Siret, ExtraitRcsDto, StructureIdentifiers } from "dto";
import { API_ENTREPRISE_TOKEN } from "../../../configurations/apis.conf";
import { DefaultObject } from "../../../@types";
import StructureIdentifiersError from "../../../shared/errors/StructureIdentifierError";
import { isSiren, isSiret } from "../../../shared/Validators";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";
import AssociationsProvider from "../../associations/@types/AssociationsProvider";
import ProviderCore from "../ProviderCore";
import IApiEntrepriseHeadcount from "./@types/IApiEntrepriseHeadcount";

export class ApiEntrepriseService extends ProviderCore implements EtablissementProvider, AssociationsProvider {
    static API_URL = "https://entreprise.api.gouv.fr/";

    isEtablissementProvider = true;
    isAssociationsProvider = true;

    HEADCOUNT_REASON = "Remonter l'effectif pour le service Data.Subvention";
    RCS_EXTRACT_REASON = "Remonter l'extrait RCS d'une associaiton pour Data.Subvention";

    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);

    constructor() {
        super({
            name: "API Entreprise",
            type: ProviderEnum.api,
            id: "api_entreprise",
            description:
                "L'API Entreprise est une API portée par la Dinum qui permet d'exposer et partager des données relatives aux entreprises (dont les associations) issues de plusieurs sources (SIREN/SIRET, Banque de France, Infogreffe, Acoss...).",
        });
    }

    private async sendRequest<T>(
        route: string,
        queryParams: DefaultObject<string>,
        reason: string,
        isNewAPI = true,
    ): Promise<T | null> {
        const defaultParams = {
            context: "aides publiques",
            recipient: "12004101700035",
            object: reason,
        };

        const params = qs.stringify({ ...defaultParams, ...queryParams });
        const url = new URL(route, ApiEntrepriseService.API_URL).href;

        const fullURL = `${url}?${params}`;

        if (this.requestCache.has(fullURL)) {
            return this.requestCache.get(fullURL)[0] as T | null;
        }

        let result;
        if (isNewAPI) {
            result = await this.http.get<T>(fullURL, {
                headers: {
                    Authorization: `Bearer ${API_ENTREPRISE_TOKEN}`,
                },
            });
        } else {
            result = await this.http.get<T>(`${fullURL}&token=${API_ENTREPRISE_TOKEN}`);
        }
        this.requestCache.add(fullURL, result.status == 200 ? result.data : null);

        if (result.status == 200) return result.data;
        return null;
    }

    /**
     * Récupère les effectifs d'une association ou d'un établissement
     * @param id StructureIdentifier RNA, SIREN ou SIRET
     * Si un SIRET est donné, alors renvoi l'effectif pour l'établissement donné
     */
    public async getHeadcount(id: StructureIdentifiers) {
        if (isSiret(id)) {
            let retries = 0;
            let headcount;
            let error;
            // At the time of this writting, API Entreprise returns a 404 error if their is no entry for the year + month
            // We retry a maximum of 5 times, going back from one month each time trying to find the last headcount saved
            while (retries < 5) {
                try {
                    headcount = (await this.getEtablissementHeadcount(id, retries)) as IApiEntrepriseHeadcount;
                    retries = 5;
                } catch (e) {
                    retries++;
                    error = e;
                    if ((e as AxiosError)?.response?.status != 404) retries = 5;
                }
            }
            if (headcount) return headcount;
            else if (error) throw error;
            else return null;
        } else throw new StructureIdentifiersError();
    }

    private buildHeadcountUrl(siret: Siret, subtractMonths = 0) {
        const today = new Date().toISOString();
        const split = today.split("-");
        let year = Number(split[0]);
        let month = Number(split[1]) - subtractMonths;
        if (month <= 0) {
            year -= 1;
            month = 12 - month;
        }
        if (month < 10) return `v2/effectifs_mensuels_acoss_covid/${year}/0${month}/etablissement/${siret}`;
        else return `v2/effectifs_mensuels_acoss_covid/${year}/${month}/etablissement/${siret}`;
    }

    private async getEtablissementHeadcount(siret: Siret, subtractMonths = 0) {
        return this.sendRequest<IApiEntrepriseHeadcount>(
            `${this.buildHeadcountUrl(siret, subtractMonths)}`,
            {},
            this.HEADCOUNT_REASON,
            false,
        );
    }

    public async getExtractRcs(siren: Siren) {
        if (isSiren(siren)) {
            try {
                return (
                    await this.sendRequest<{ data: ExtraitRcsDto }>(
                        `v3/infogreffe/rcs/unites_legales/${siren}/extrait_kbis`,
                        {},
                        this.RCS_EXTRACT_REASON,
                    )
                )?.data;
            } catch (e) {
                return null;
            }
        } else {
            throw new StructureIdentifiersError("siren");
        }
    }

    async getEtablissementsBySiret(siret: Siret) {
        return null;
        // try {
        //     const result = await this.getHeadcount(siret);
        //     if (!result) return null;
        //     return [ApiEntrepriseAdapter.toEtablissement(result)];
        // } catch {
        //     return null;
        // }
    }

    async getEtablissementsBySiren(_siret: Siren) {
        return null;
    }

    async getAssociationsBySiren(siren: string): Promise<Association[] | null> {
        return null;
        // try {
        //     const result = await this.getExtractRcs(siren);
        //     if (!result) return null;
        //     return [ApiEntrepriseAdapter.toAssociation(result)];
        // } catch (e) {
        //     return null;
        // }
    }

    async getAssociationsBySiret(siret: string): Promise<Association[] | null> {
        return null;
        // return await this.getAssociationsBySiren(siretToSiren(siret));
    }

    async getAssociationsByRna(_rna: string): Promise<Association[] | null> {
        return null;
    }
}

const apiEntrepriseService = new ApiEntrepriseService();

export default apiEntrepriseService;
