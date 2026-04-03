import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../shared/LegalCategoriesAccepted";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../../modules/provider-request/provider-request.service";
import { RechercheEntreprisesPort } from "./recherche-entreprises.port";
import { RechercheEntreprisesDto } from "./@types/RechercheEntreprisesDto";

export class RechercheEntreprisesAdapter implements RechercheEntreprisesPort {
    private static URL = "https://recherche-entreprises.api.gouv.fr/search";
    private http: ProviderRequestService;

    constructor() {
        this.http = ProviderRequestFactory("recherche-entreprise");
    }

    public async search(query: string, page = 1): Promise<RechercheEntreprisesDto | null> {
        try {
            const result = await this.http.get<RechercheEntreprisesDto>(
                RechercheEntreprisesAdapter.URL +
                    `?q=${query}&nature_juridique=${LEGAL_CATEGORIES_ACCEPTED.join(",")}&per_page=25&page=${page}`,
            );
            return result.data;
        } catch (e: unknown) {
            console.error(e);
            return null;
        }
    }
}

const rechercheEntreprisesAdapter = new RechercheEntreprisesAdapter();

export default rechercheEntreprisesAdapter;
