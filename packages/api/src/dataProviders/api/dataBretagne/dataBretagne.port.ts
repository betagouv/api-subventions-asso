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

    async getCollection<T>(collection: string) {
        return (
            await this.http.get<{ items: T[] }>(`${this.basepath}/${collection}?limit=4000`, {
                headers: {
                    Authorization: this.token,
                },
            })
        )?.data?.items;
    }

    async getStateBudgetPrograms() {
        // to DO : modify tests
        return (await this.getCollection<DataBretagneProgrammeDto>("programme")).map(
            DataBretagneProgrammeAdapter.toEntity,
        );
    }

    async getMinistry() {
        return (await this.getCollection<DataBretagneMinistryDto>("ministere")).map(
            DataBretagneMinistryAdapter.toEntity,
        );
    }

    async getDomaineFonctionnel() {
        return (await this.getCollection<DataBretagneDomaineFonctionnelDto>("domaine-fonct")).map(
            DataBretagneDomaineFonctionnelAdapter.toEntity,
        );
    }

    async getRefProgrammation() {
        return (await this.getCollection<DataBretagnenRefProgrammationDto>("ref-programmation")).map(
            DataBretagneRefProgrammationAdapter.toEntity,
        );
    }
}

const dataBretagnePort = new DataBretagnePort();
export default dataBretagnePort;
