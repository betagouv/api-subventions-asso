import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import ProviderRequestFactory, {
    ProviderRequestService,
} from "../../../modules/provider-request/providerRequest.service";
import { RechercheEntreprisesDto, RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";

export class RechercheEntreprises {
    private URL = "https://recherche-entreprises.api.gouv.fr/search";
    private http: ProviderRequestService;
    private natureJuridique = LEGAL_CATEGORIES_ACCEPTED.filter(id => id !== "92").join(",");

    constructor() {
        this.http = ProviderRequestFactory("recherche-entreprise");
    }

    async search(query: string) {
        const answer = await this.http.get<RechercheEntreprisesDto>(
            this.URL + `?q=${query}&nature_juridique=${this.natureJuridique}`,
        );

        return (
            answer.data.results?.reduce((acc, result) => {
                if (!result.nom_complet || !result.siren) return acc;
                const dto = result as RechercheEntreprisesResultDto & { siren: string; nom_complet: string }; // tell ts that the new typing is good
                return acc.concat([RechercheEntreprisesAdapter.toAssociationNameEntity(dto)]);
            }, [] as AssociationNameEntity[]) || []
        );
    }
}

const rechercheEntreprises = new RechercheEntreprises();

export default rechercheEntreprises;
