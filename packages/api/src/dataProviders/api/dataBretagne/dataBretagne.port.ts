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
        this.token = (
            await this.http.post<string>(`${this.basepath}/auth/login`, {
                email: DATA_BRETAGNE_USERNAME,
                password: DATA_BRETAGNE_PASSWORD,
            })
        )?.data;
    }

    async getProgramme(bop) {
        return (await this.http.get<DataBretagneDto>(`${this.basepath}/programme/${bop}`)).data;
    }

    async getProgrammes() {
        if (this.token) {
            // limit 400 to get ALL programme one shot. 334 programmes as of today
            // TODO (maxime): make one request with limit 1 and another with limit = total rows returned ?
            return (
                await this.http.get<{ items: DataBretagneDto[] }>(`${this.basepath}/programme?limit=400`, {
                    headers: {
                        Authorization: this.token,
                    },
                })
            )?.data?.items;
        } else {
            throw new Error("You must be connected");
        }
    }
}

const dataBretagnePort = new DataBretagnePort();
export default dataBretagnePort;
