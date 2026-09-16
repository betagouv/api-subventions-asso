import associationNameService from "../association-name/associationName.service";
import searchAdapter from "../../adapters/outputs/db/search/search.adapter";
import AssociationNameEntity from "../association-name/entities/AssociationNameEntity";
import PaginatedResult from "../../@types/PaginatedResult";

export class SearchService {
    PAGE_SIZE = 12;
    CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    public async getAssociationsKeys(value: string): Promise<AssociationNameEntity[]> {
        const resultsFromCache = await searchAdapter.getResults(value, new Date(Date.now() - this.CACHE_LIFESPAN_MS));

        if (resultsFromCache) return resultsFromCache;

        // nothing in cache
        // @TODO: pagination has been removed because not used properly but we should limit the result of the find
        const entities = await associationNameService.find(value);
        searchAdapter.saveResults(value, entities);

        return entities;
    }

    public async getPaginatedResult(value: string, page: number): Promise<PaginatedResult<AssociationNameEntity[]>> {
        const results = await this.getAssociationsKeys(value);
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
}

const searchService = new SearchService();

export default searchService;
