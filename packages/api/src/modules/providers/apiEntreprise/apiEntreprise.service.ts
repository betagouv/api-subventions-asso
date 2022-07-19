import axios, { AxiosError } from "axios";
import qs from "qs";

import { API_ENTREPRISE_TOKEN } from "../../../configurations/apis.conf"
import { DefaultObject, StructureIdentifiers } from "../../../@types";
import StructureIdentifiersError from "../../../shared/errors/StructureIdentifierError";
import { isSiren, isSiret } from "../../../shared/Validators";
import { Siren, Siret } from "@api-subventions-asso/dto";
import IApiEntrepriseHeadcount from "./@types/IApiEntrepriseHeadcount";
import ExtraitRcs from "@api-subventions-asso/dto/associations/ExtraitRcs";

export class ApiEntrepriseService {
    static API_URL = "https://entreprise.api.gouv.fr/v2/"
    HEADCOUNT_REASON = "Remonter l'effectif pour le service Data.Subvention";
    RCS_EXTRACT_REASON = "Remonter l'extrait RCS d'une associaiton pour Data.Subvention";

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
        if (isSiret(id)) {
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

        } else throw new StructureIdentifiersError()
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
        return this.sendRequest(`${this.buildHeadcountUrl(subtractMonths)}/etablissement/${siret}`, {}, this.HEADCOUNT_REASON);
    }

    public async getExtractRcs(siren: Siren) {
        if (isSiren(siren)) {
            try {
                return await this.sendRequest(`extraits_rcs_infogreffe/${siren}`, {}, this.RCS_EXTRACT_REASON) as ExtraitRcs
            } catch (e) {
                return null;
            }
        } else {
            throw new StructureIdentifiersError("siren");
        }
    }
}

const apiEntrepriseService = new ApiEntrepriseService();

export default apiEntrepriseService;