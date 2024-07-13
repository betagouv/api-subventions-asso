import { AxiosError } from "axios";
import { DATA_BRETAGNE_PASSWORD, DATA_BRETAGNE_USERNAME } from "../../../configurations/apis.conf";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import {
    DataBretagneProgrammeDto,
    DataBretagneMinistryDto,
    DataBretagneDomaineFonctionnelDto,
    DataBretagnenRefProgrammationDto,
} from "./DataBretagneDto";
import DataBretagneProgrammeAdapter from "./DataBretagneProgrammeAdapter";
import DataBretagneMinistryAdapter from "./DataBretagneMinistryAdapter";
import DataBretagneDomaineFonctionnelAdapter from "./DataBretagneDomaineFonctionnelAdapter";
import DataBretagneRefProgrammationAdapter from "./DataBretagneRefProgrammationAdapter";

export class DataBretagnePort {
    private basepath = "https://api.databretagne.fr/budget/api/v1";
    private http: ProviderRequestService;
    private token: null | string = null;
    constructor() {
        this.http = ProviderRequestFactory("data-bretagne");
    }

    async login() {
        try {
            this.token = (
                await this.http.post<string>(`${this.basepath}/auth/login`, {
                    email: DATA_BRETAGNE_USERNAME,
                    password: DATA_BRETAGNE_PASSWORD,
                })
            )?.data;
        } catch (e) {
            if ((e as AxiosError).status === 403) throw new Error("Connection to API Data Bretagne failed");
            throw e;
        }
    }

    async getStateBudgetPrograms() {
        return (
            await this.http.get<{ items: DataBretagneProgrammeDto[] }>(`${this.basepath}/programme?limit=400`, {
                headers: {
                    Authorization: this.token,
                },
            })
        )?.data?.items.map(DataBretagneProgrammeAdapter.toEntity);
    }

    async getMinistry() {
        return (
            await this.http.get<{ items: DataBretagneMinistryDto[] }>(`${this.basepath}/ministere?limit=400`, {
                headers: {
                    Authorization: this.token,
                },
            })
        )?.data?.items.map(DataBretagneMinistryAdapter.toEntity);
    }

    async getDomaineFonctionnel() {
        return (
            await this.http.get<{ items: DataBretagneDomaineFonctionnelDto[] }>(
                `${this.basepath}/domaine-fonct?limit=4000`,
                {
                    headers: {
                        Authorization: this.token,
                    },
                },
            )
        )?.data?.items.map(DataBretagneDomaineFonctionnelAdapter.toEntity);
    }

    async getRefProgrammation() {
        return (
            await this.http.get<{ items: DataBretagnenRefProgrammationDto[] }>(
                `${this.basepath}/ref-programmation?limit=4000`,
                {
                    headers: {
                        Authorization: this.token,
                    },
                },
            )
        )?.data?.items.map(DataBretagneRefProgrammationAdapter.toEntity);
    }
}

const dataBretagnePort = new DataBretagnePort();
export default dataBretagnePort;
