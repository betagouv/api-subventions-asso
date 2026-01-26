import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import { RechercheEntreprisesDto } from "./RechercheEntreprisesDto";

export class RechercheEntreprisesPort {
    private static URL = "https://recherche-entreprises.api.gouv.fr/search";
    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("recherche-entreprise");
    }

    public async search(query: string, page = 1) {
        try {
            const result = await this.http.get<RechercheEntreprisesDto>(
                RechercheEntreprisesPort.URL +
                    `?q=${query}&nature_juridique=${LEGAL_CATEGORIES_ACCEPTED.join(",")}&per_page=25&page=${page}`,
            );
            return result.data;
        } catch (e: unknown) {
            console.error(e);
            return null;
        }
    }
}

const rechercheEntreprisesPort = new RechercheEntreprisesPort();

export default rechercheEntreprisesPort;
