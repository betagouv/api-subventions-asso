import axios, { AxiosError } from "axios";
import qs from "qs";

import { API_ENTREPRISE_TOKEN } from "../../../configurations/apis.conf"
import { DefaultObject, StructureIdentifiers } from "../../../@types";
import StructureIdentifiersError from "../../../shared/errors/StructureIdentifierError";
import { isSiret } from "../../../shared/Validators";
import { Siren, Siret } from "@api-subventions-asso/dto";
import IApiEntrepriseHeadcount from "./@types/IApiEntrepriseHeadcount";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import ApiEntrepriseAdapter from "./adapters/ApiEntrepriseAdapter";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import CacheData from "../../../shared/Cache";
import { CACHE_TIMES } from "../../../shared/helpers/TimeHelper";

export class ApiEntrepriseService implements EtablissementProvider {
    static API_URL = "https://entreprise.api.gouv.fr/v2/"
    provider = { 
        name: "API Entreprise",
        type: ProviderEnum.api,
        description: "L'API Entreprise est une API portée par la Dinum qui permet d'exposer et partager des données relatives aux entreprises (dont les associations) issues de plusieurs sources (SIREN/SIRET, Banque de France, Infogreffe, Acoss...).",
    };
    HEADCOUNT_REASON = "Remonter l'effectif pour le service Data.Subvention";

    private requestCache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);


    private async sendRequest<T>(route: string, queryParams: DefaultObject<string>, reason: string): Promise<T | null> {
        const defaultParams = {
            token: API_ENTREPRISE_TOKEN,
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

        const result = await axios.get<T>(fullURL);

        this.requestCache.add(fullURL, result.status == 200 ? result.data : null)

        if (result.status == 200) return result.data;
        return null;
    }

    /**
     * Récupère les effectifs d'une association ou d'un établissement
     * @param id StructureIdentifier RNA, SIREN ou SIRET
     * Si un SIRET est donné, alors renvoi l'effectif pour l'établissement donné
     */
    public async getHeadcount(id: StructureIdentifiers) {
        if (!isSiret(id)) throw new StructureIdentifiersError();
        let retries = 0;
        let headcount;
        let error;
        // At the time of this writting, API Entreprise returns a 404 error if their is no entry for the year + month
        // We retry a maximum of 5 times, going back from one month each time trying to find the last headcount saved
        while (retries < 5) {
            try {
                headcount = await this.getEtablissementHeadcount(id, retries);
                retries = 5;
            } catch (e) {
                retries++;
                error = e
                if ((e as AxiosError)?.response?.status != 404) retries = 5;
            }
        }
        if (headcount) return headcount;
        else if (error) throw error;
        else return null;
    }

    private buildHeadcountUrl(subtractMonths = 0) {
        const today = new Date();
        if (subtractMonths != 0) today.setMonth(today.getMonth() - subtractMonths);
        const year = today.getFullYear();
        let month: string | number = today.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        return `effectifs_mensuels_acoss_covid/${year}/${month}`;
    }

    private async getEtablissementHeadcount(siret: Siret, subtractMonths = 0) {
        return this.sendRequest<IApiEntrepriseHeadcount>(`${this.buildHeadcountUrl(subtractMonths)}/etablissement/${siret}`, {}, this.HEADCOUNT_REASON);
    }

    isEtablissementProvider = true;

    async getEtablissementsBySiret(siret: Siret) {
        try {
            const result = await this.getHeadcount(siret);
            if (!result) return null;
            return [ApiEntrepriseAdapter.toEtablissement(result)];
        } catch {
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getEtablissementsBySiren(_siret: Siren) {
        return null;
    }

}

const apiEntrepriseService = new ApiEntrepriseService();

export default apiEntrepriseService;