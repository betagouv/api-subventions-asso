import associationNameService from "../association-name/associationName.service";
import searchAdapter from "../../adapters/outputs/db/search/search.adapter";
import PaginatedResult from "../../@types/PaginatedResult";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";

export class SearchService {
    PAGE_SIZE = 12;
    CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    public async getAssociationsKeys(value: string, postalCode?: string): Promise<Partial<AssociationSearchEntity>[]> {
        const searchToken = this.buildSearchToken(value, postalCode);
        const resultsFromCache = await searchAdapter.getResults(
            searchToken,
            new Date(Date.now() - this.CACHE_LIFESPAN_MS),
        );

        if (resultsFromCache) return resultsFromCache;

        // nothing in cache
        // @TODO: pagination has been removed because not used properly but we should limit the result of the find
        const entities = await associationNameService.find(value, postalCode);
        searchAdapter.saveResults(searchToken, entities);

        return entities;
    }

    public async getPaginatedResult(
        value: string,
        page: number,
        postalCode?: string,
    ): Promise<PaginatedResult<Partial<AssociationSearchEntity>[]>> {
        const results = await this.getAssociationsKeys(value, postalCode);
        const paginatedResult = results.slice((page - 1) * this.PAGE_SIZE, page * this.PAGE_SIZE);
        return {
            results: paginatedResult,
            page,
            nbPages: Math.ceil(results.length / this.PAGE_SIZE),
            total: results.length,
        };
    }

    public cleanCache() {
        return searchAdapter.deleteAll();
    }

    private buildSearchToken(value: string, postalCode?: string) {
        if (!postalCode) return value;
        return `${value}__postalCode:${postalCode}`;
    }
}

const searchService = new SearchService();

export default searchService;
