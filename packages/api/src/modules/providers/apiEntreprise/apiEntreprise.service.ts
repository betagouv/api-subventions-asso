import axios, { AxiosError } from "axios";
import qs from "qs";

import { API_ENTREPRISE_TOKEN } from "../../../configurations/apis.conf"
import { DefaultObject, StructureIdentifiers } from "../../../@types";
import StructureIdentifiersError from "../../../shared/errors/StructureIdentifierError";
import { isSiret } from "../../../shared/Validators";
import { Etablissement, Siret } from "@api-subventions-asso/dto";
import IApiEntrepriseHeadcount from "./@types/IApiEntrepriseHeadcount";
import EtablissementProvider from "../../etablissements/@types/EtablissementProvider";
import { siretToNIC } from "../../../shared/helpers/SirenHelper";
import EtablissementDtoAdapter from "../dataEntreprise/adapters/EtablissementDtoAdapter";
import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ApiEntrepriseAdapter from "./adapters/apiEntreprise.adapter";

export class ApiEntrepriseService implements EtablissementProvider {
    isEtablissementProvider = true;

    public provider = {
        name: "API ENTREPRISE",
        type: ProviderEnum.api,
        description: "L'API Entreprise permet un accès direct, standardisé et documenté aux informations administratives des entreprises"
    };

    static API_URL = "https://entreprise.api.gouv.fr/v2/";
    HEADCOUNT_REASON = "Remonter l'effectif pour le service Data.Subvention";

    private async sendRequest<T>(route: string, queryParams: DefaultObject<string>, reason: string) {
        const defaultParams = {
            token: API_ENTREPRISE_TOKEN,
            context: "aides publiques",
            recipient: "12004101700035",
            object: reason,
        };

        const params = qs.stringify({ ...defaultParams, ...queryParams });
        const url = new URL(route, ApiEntrepriseService.API_URL).href;

        const result = await axios.get<T>(`${url}?${params}`);
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
                headcount = await this.getEtablissementHeadcount(id, retries) as IApiEntrepriseHeadcount;
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
        const month = ("0" + (today.getMonth() + 1)).slice(-2);
        return `effectifs_mensuels_acoss_covid/${year}/${month}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getEtablissementsBySiret(siret: string, wait?: boolean | undefined): Promise<Etablissement[] | null> {
        const result = await this.getHeadcount(siret);

        const etablissement = ApiEntrepriseAdapter.toEtablissement({
            siret: siret,
            nic: siretToNIC(siret),
            headcount: result?.effectifs_mensuels
        })

        return [etablissement]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getEtablissementsBySiren(siret: string, wait?: boolean | undefined): Promise<Etablissement[] | null> {
        throw new Error("Not implemented by API Entreprise");
    }

    private async getEtablissementHeadcount(siret: Siret, subtractMonths = 0) {
        return this.sendRequest(`${this.buildHeadcountUrl(subtractMonths)}/etablissement/${siret}`, {}, this.HEADCOUNT_REASON);
    }
}

const apiEntrepriseService = new ApiEntrepriseService();

export default apiEntrepriseService;