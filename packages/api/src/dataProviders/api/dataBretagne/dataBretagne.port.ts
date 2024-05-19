import { AxiosError } from "axios";
import { DATA_BRETAGNE_PASSWORD, DATA_BRETAGNE_USERNAME } from "../../../configurations/apis.conf";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import { DataBretagneDto } from "./DataBretagneDto";

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

    async getProgramme(code) {
        return (await this.http.get<DataBretagneDto>(`${this.basepath}/programme/${code}`)).data;
    }

    async getProgrammes() {
        return (
            await this.http.get<{ items: DataBretagneDto[] }>(`${this.basepath}/programme?limit=400`, {
                headers: {
                    Authorization: this.token,
                },
            })
        )?.data?.items;
    }
}

const dataBretagnePort = new DataBretagnePort();
export default dataBretagnePort;
