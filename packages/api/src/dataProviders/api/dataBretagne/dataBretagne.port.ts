import { AxiosError } from "axios";
import { DATA_BRETAGNE_PASSWORD, DATA_BRETAGNE_USERNAME } from "../../../configurations/apis.conf";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import {
    DataBretagneProgrammeDto,
    DataBretagneMinistryDto,
    DataBretagneDomaineFonctionnelDto,
    DataBretagneRefProgrammationDto,
} from "./DataBretagneDto";
import {
    DataBretagneDomaineFonctionnelMapper,
    DataBretagneMinistryMapper,
    DataBretagneProgrammeMapper,
    DataBretagneRefProgrammationMapper,
} from "./data-bretagne.mapper";
import {
    DataBretagneDomaineFonctionnelValidator,
    DataBretagneMinistryValidator,
    DataBretagneProgrammeValidator,
    DataBretagneRefProgrammationValidator,
} from "./DataBretagneValidator";

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
            await this.http.get<{ items: T[] }>(`${this.basepath}/${collection}?limit=1000000`, {
                headers: {
                    Authorization: this.token,
                },
            })
        )?.data?.items;
    }

    async getStateBudgetPrograms() {
        const validData = DataBretagneProgrammeValidator.validate(
            await this.getCollection<DataBretagneProgrammeDto>("programme"),
        );
        return validData.valids.map(DataBretagneProgrammeMapper.toEntity);
    }

    async getMinistry() {
        const validData = DataBretagneMinistryValidator.validate(
            await this.getCollection<DataBretagneMinistryDto>("ministere"),
        );
        return validData.valids.map(DataBretagneMinistryMapper.toEntity);
    }

    async getDomaineFonctionnel() {
        const validData = DataBretagneDomaineFonctionnelValidator.validate(
            await this.getCollection<DataBretagneDomaineFonctionnelDto>("domaine-fonct"),
        );
        return validData.valids.map(DataBretagneDomaineFonctionnelMapper.toEntity);
    }

    async getRefProgrammation() {
        const validData = DataBretagneRefProgrammationValidator.validate(
            await this.getCollection<DataBretagneRefProgrammationDto>("ref-programmation"),
        );
        return validData.valids.map(DataBretagneRefProgrammationMapper.toEntity);
    }
}

const dataBretagnePort = new DataBretagnePort();
export default dataBretagnePort;
