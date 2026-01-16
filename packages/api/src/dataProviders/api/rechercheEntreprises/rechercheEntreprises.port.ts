import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import { RechercheEntreprisesDto, RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";

export class RechercheEntreprisesPort {
    private static URL = "https://recherche-entreprises.api.gouv.fr/search";
    private http: ProviderRequestService;
    private static natureJuridique = LEGAL_CATEGORIES_ACCEPTED.join(",");

    constructor() {
        this.http = ProviderRequestFactory("recherche-entreprise");
    }

    private async getSearchResult(query: string, page = 1) {
        try {
            const result = await this.http.get<RechercheEntreprisesDto>(
                RechercheEntreprisesPort.URL +
                    `?q=${query}&nature_juridique=${RechercheEntreprisesPort.natureJuridique}&per_page=25&page=${page}`,
            );
            return result.data;
        } catch (e: unknown) {
            console.error(e);
            return null;
        }
    }

    async search(query: string): Promise<RechercheEntreprisesResultDto[]> {
        const results: RechercheEntreprisesResultDto[] = [];
        let response: RechercheEntreprisesDto | null;
        let page = 1;
        let maxPage = 3;

        do {
            response = await this.getSearchResult(query);
            if (!response) return results;
            results.push(...(response.results || []));
            page += 1;
            maxPage = response.total_pages;
        } while (page <= Math.min(maxPage, 3));

        return results;
    }
}

const rechercheEntreprisesPort = new RechercheEntreprisesPort();

export default rechercheEntreprisesPort;
