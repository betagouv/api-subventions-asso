import { PaginatedAssociationNameDto } from "dto";
import associationNameService from "../association-name/associationName.service";
import searchRepository from "./repositories/search.repository";

export class SearchService {
    static PAGE_SIZE = 12;
    static CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    public async getAssociationsKeys(value: string, page = 1): Promise<PaginatedAssociationNameDto> {
        const resultsFromCache = await searchRepository.getResults(
            value,
            page,
            SearchService.PAGE_SIZE,
            new Date(Date.now() - SearchService.CACHE_LIFESPAN_MS),
        );

        if (resultsFromCache)
            return {
                nbPages: Math.ceil(resultsFromCache.total / SearchService.PAGE_SIZE),
                page,
                results: resultsFromCache.results,
                totalResults: resultsFromCache.total,
            };

        // nothing in cache
        const results = await associationNameService.find(value);
        const nbResults = results.length;
        searchRepository.saveResults(value, results);

        return {
            nbPages: Math.ceil(nbResults / SearchService.PAGE_SIZE),
            page: 1,
            results: results.slice((page - 1) * SearchService.PAGE_SIZE, page * SearchService.PAGE_SIZE),
            totalResults: results.length,
        };
    }

    public cleanCache() {
        return searchRepository.deleteAll();
    }
}

const searchService = new SearchService();

export default searchService;
