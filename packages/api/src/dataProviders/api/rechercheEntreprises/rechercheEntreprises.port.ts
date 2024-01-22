import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import { RechercheEntreprisesDto, RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";

export class RechercheEntreprises {
    private static URL = "https://recherche-entreprises.api.gouv.fr/search";
    private http: ProviderRequestService;
    private static natureJuridique = LEGAL_CATEGORIES_ACCEPTED.filter(id => id !== "92").join(",");

    constructor() {
        this.http = ProviderRequestFactory("recherche-entreprise");
    }

    private async getSearchResult(query: string, page = 1) {
        try {
            const resut = await this.http.get<RechercheEntreprisesDto>(
                RechercheEntreprises.URL +
                    `?q=${query}&nature_juridique=${RechercheEntreprises.natureJuridique}&per_page=25&page=${page}`,
            );
            return resut.data;
        } catch (e: unknown) {
            console.error(e);
            return null;
        }
    }

    async search(query: string) {
        const addResults = (response: RechercheEntreprisesDto) =>
            response.results?.forEach(result => {
                if (!result.nom_complet || !result.siren) return;
                const dto = result as RechercheEntreprisesResultDto & { siren: string; nom_complet: string }; // tell ts that the new typing is good
                return results.push(RechercheEntreprisesAdapter.toAssociationNameEntity(dto));
            });

        const results: AssociationNameEntity[] = [];
        let response: RechercheEntreprisesDto | null;
        let page = 1;
        let maxPage = 3;

        do {
            response = await this.getSearchResult(query);
            if (!response) return results;
            addResults(response);
            page += 1;
            maxPage = response.total_pages;
        } while (page <= Math.min(maxPage, 3));

        return results;
    }
}

const rechercheEntreprises = new RechercheEntreprises();

export default rechercheEntreprises;
