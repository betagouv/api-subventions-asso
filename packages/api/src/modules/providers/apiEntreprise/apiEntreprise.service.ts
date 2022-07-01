import axios from "axios";
import path from "path";
import qs from "qs";

import { API_ENTREPRISE_TOKEN } from "../../../configurations/apis.conf"
import { DefaultObject } from "../../../@types";

export class ApiEntrepriseService {
    static API_URL = "https://entreprise.api.gouv.fr/"

    private async sendRequest<T>(route: string, queryParams: DefaultObject<string>, reason: string) {
        const defaultParams = {
            token: API_ENTREPRISE_TOKEN,
            context: "aides publiques",
            recipent: "12004101700035",
            object: reason,
        };

        const params = qs.stringify({...defaultParams, queryParams});
        const url = path.join(ApiEntrepriseService.API_URL, route);

        try {
            const result = await axios.get<T>(`${url}?${params}`, {});

            if (result.status == 200) return result.data;

            return null;
        } catch (e) {
            return null;
        }
    }
}

const apiEntrepriseService = new ApiEntrepriseService();

export default apiEntrepriseService;