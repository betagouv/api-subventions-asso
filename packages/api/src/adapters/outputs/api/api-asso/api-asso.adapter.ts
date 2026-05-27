import { Rna, Siren } from "../../../../identifier-objects";
import ApiAssoPort from "./api-asso.port";
import { ProviderRequestService } from "../../../../modules/provider-request/provider-request.service";
import CacheData from "../../../../shared/Cache";
import { CACHE_TIMES } from "../../../../shared/helpers/TimeHelper";
import { API_ASSO_TOKEN, API_ASSO_URL } from "../../../../configurations/apis.conf";
import StructureDto, { StructureDocumentDto } from "../../../../modules/providers/api-asso/dto/StructureDto";
import { SirenStructureDto } from "../../../../modules/providers/api-asso/dto/SirenStructureDto";
import { RequestResponse } from "../../../../modules/provider-request/@types/RequestResponse";
import { RnaStructureDto } from "../../../../modules/providers/api-asso/dto/RnaStructureDto";

class ApiAssoAdapter implements ApiAssoPort {
    private http: ProviderRequestService;
    private cache: CacheData<unknown>;
    private basePath: string;

    constructor() {
        this.basePath = API_ASSO_URL as string;
        this.cache = new CacheData<unknown>(CACHE_TIMES.ONE_DAY);
        this.http = new ProviderRequestService("api-asso");
    }

    private cacheAndReturn<T>(route: string, response: RequestResponse<T>): T | null {
        if (response.status === 200 && (typeof response.data != "string" || !response.data.includes("Error"))) {
            this.cache.add(route, response.data);
            return response.data;
        }
        return null;
    }

    private send<T>(route: string) {
        const cacheResponse = this.cache.get(route);
        if (cacheResponse) return Promise.resolve(cacheResponse as T);
        else
            return this.http
                .get<T>(route, {
                    headers: {
                        Accept: "application/json",
                        "X-Gravitee-Api-Key": API_ASSO_TOKEN as string,
                    },
                })
                .then(response => this.cacheAndReturn(route, response));
    }

    getStructure(identifier: Rna | Siren) {
        const route = `${this.basePath}/api/structure/${identifier.value}`;
        return this.send<StructureDto>(route);
    }

    getRnaStructure(rna: Rna) {
        const route = `${this.basePath}/api/rna/${rna.value}`;
        return this.send<RnaStructureDto>(route);
    }

    getSirenStructure(siren: Siren) {
        const route = `${this.basePath}/api/siren/${siren.value}`;
        return this.send<SirenStructureDto>(route);
    }

    getDocuments(identifier: Rna | Siren) {
        const route = `${this.basePath}/proxy_db_asso/documents/${identifier.value}`;
        return this.send<StructureDocumentDto>(route);
    }
}

const apiAssoAdapter = new ApiAssoAdapter();
export default apiAssoAdapter;
