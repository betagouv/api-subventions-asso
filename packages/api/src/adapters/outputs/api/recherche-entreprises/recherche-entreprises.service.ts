import AssociationNameEntity from "../../../../modules/association-name/entities/AssociationNameEntity";
import rechercheEntreprisesAdapter from "./recherche-entreprises.adapter";
import { RechercheEntreprisesDto, RechercheEntreprisesResultDto } from "./@types/RechercheEntreprisesDto";
import { RechercheEntreprisesMapper } from "./recherche-entreprises.mapper";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../shared/LegalCategoriesAccepted";
import notifyService from "../../../../modules/notify/notify.service";
import { NotificationType } from "../../../../modules/notify/@types/NotificationType";
import Provider from "../../../../modules/providers/@types/IProvider";
import { ProviderEnum } from "../../../../@enums/ProviderEnum";
import associationHelper from "../../../../modules/associations/associations.helper";
import { NotAssociationError } from "core";
import Siren from "../../../../identifier-objects/Siren";

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
        const searchResult = (await this.search(query)).filter(dto => dto.siren && dto.nom_complet);

        if (searchResult.length === 0) return [];

        if (Siren.isSiren(query)) {
            // this notify the team if API Recherche Entreprise returns structure not from the LEGAL_CATEGORIES_ACCEPTED
            // this was double checked and we decided to trust the API with its nature_juridique query filter
            // @TODO: remove this call start of april 2026 if nothing was notified
            if (searchResult.length > 1) this.notifyOrNot(searchResult, query); // this should not be called anymore as we called from siren or rna
            const dto = searchResult[0];
            if (!associationHelper.isCategoryFromAsso(dto?.nature_juridique)) throw new NotAssociationError();
            return [
                RechercheEntreprisesMapper.toAssociationNameEntity(
                    dto as RechercheEntreprisesResultDto & { siren: string; nom_complet: string },
                ),
            ];
        }

        return searchResult.map(dto =>
            RechercheEntreprisesMapper.toAssociationNameEntity(
                dto as RechercheEntreprisesResultDto & { siren: string; nom_complet: string },
            ),
        );
    }

    /**
     *   /!\ recursive function /!\
     */
    async search(query: string, page = 1): Promise<RechercheEntreprisesResultDto[]> {
        const response = await rechercheEntreprisesAdapter.search(query, page);
        const results = response?.results;
        if (!response || !results) return [];

        if (this.requestNextPage(response)) {
            return results.concat(await this.search(query, page + 1));
        } else return results;
    }
}

const rechercheEntreprisesService = new RechercheEntreprisesService();
export default rechercheEntreprisesService;
