import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import rechercheEntreprisesPort from "./rechercheEntreprises.port";
import { RechercheEntreprisesDto, RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../shared/LegalCategoriesAccepted";
import notifyService from "../../../modules/notify/notify.service";
import { NotificationType } from "../../../modules/notify/@types/NotificationType";
import Provider from "../../../modules/providers/@types/IProvider";
import { ProviderEnum } from "../../../@enums/ProviderEnum";

export class RechercheEntreprisesService implements Provider {
    public meta = {
        name: "API Recherche Entreprise",
        type: ProviderEnum.api,
        description: "API Recherche Entreprise",

        id: "recherche-entreprise",
    };

    private requestNextPage(response: RechercheEntreprisesDto): boolean {
        const MAX_PAGES = Math.min(response.total_pages, 3); // 3 was chosen by default but does not respond to a specific need
        return response.page < MAX_PAGES;
    }

    // @TODO: remove this call start of april 2026 if nothing was notified
    private notifyOrNot(searchResult: RechercheEntreprisesResultDto[], query: string) {
        const errors = searchResult.filter(
            result => !result.nature_juridique || !LEGAL_CATEGORIES_ACCEPTED.includes(result.nature_juridique),
        );

        if (errors.length === 0) return;

        notifyService.notify(NotificationType.EXTERNAL_API_ERROR, {
            message:
                "API Recherche Entreprise retourne des structures non association malgré leur filtre sur la nature juridique",
            details: {
                apiName: this.meta.name,
                queryParams: [{ name: "q", value: query }],
                examples: errors.slice(0, 4).map(error => ({
                    siren: error.siren,
                    nom: error.nom_complet,
                    natureJuridique: error.nature_juridique,
                })),
            },
        });
    }

    async getSearchResult(query): Promise<AssociationNameEntity[]> {
        const searchResult = await this.search(query);

        // this notify the team if API Recherche Entreprise returns structure not from the LEGAL_CATEGORIES_ACCEPTED
        // this was double checked and we decided to trust the API with its nature_juridique query filter
        // @TODO: remove this call start of april 2026 if nothing was notified
        this.notifyOrNot(searchResult, query);

        return searchResult
            .filter(dto => dto.siren && dto.nom_complet)
            .map(dto =>
                RechercheEntreprisesAdapter.toAssociationNameEntity(
                    dto as RechercheEntreprisesResultDto & { siren: string; nom_complet: string },
                ),
            );
    }

    /**
     *   /!\ recursive function /!\
     */
    async search(query: string, page = 1): Promise<RechercheEntreprisesResultDto[]> {
        const response = await rechercheEntreprisesPort.search(query, page);
        const results = response?.results;
        if (!response || !results) return [];

        if (this.requestNextPage(response)) {
            return results.concat(await this.search(query, page + 1));
        } else return results;
    }
}

const rechercheEntreprisesService = new RechercheEntreprisesService();
export default rechercheEntreprisesService;
