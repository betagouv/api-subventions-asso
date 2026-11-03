import searchAdapter from "../../adapters/outputs/db/search/search.adapter";
import PaginatedResult from "../../@types/PaginatedResult";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import search, { Search } from "../../usecases/search/search";
import getAssociationName from "../../usecases/search/get-association-name";
import { SearchSort, type AssociationSearchOptions } from "dto";
import { parseSearchLocation, type SearchLocation } from "../../usecases/search/parse-search-location";

export class SearchService {
    PAGE_SIZE = 20;
    CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    constructor(
        private search: Search,
        private parseLocation: typeof parseSearchLocation,
    ) {}

    public async getAssociationsKeys(
        value: string,
        { location, nameOnly = false }: Pick<AssociationSearchOptions, "location" | "nameOnly"> = {},
    ): Promise<AssociationSearchEntity[]> {
        const parsedLocation = this.parseLocation(location);
        const searchToken = this.buildSearchToken(value, parsedLocation, nameOnly);
        const resultsFromCache = await searchAdapter.getResults(
            searchToken,
            new Date(Date.now() - this.CACHE_LIFESPAN_MS),
        );

        if (resultsFromCache) return resultsFromCache;

        // nothing in cache
        // @TODO: pagination has been removed because not used properly but we should limit the result of the find
        const entities = await this.search.execute({ value, location: parsedLocation, nameOnly });
        searchAdapter.saveResults(searchToken, entities);

        return entities;
    }

    public async getPaginatedResult(
        value: string,
        { page = 1, location, sort = SearchSort.RELEVANCE, nameOnly = false }: AssociationSearchOptions = {},
    ) {
        const results = await this.getAssociationsKeys(value, { location, nameOnly });
        const sortedResults = sort === SearchSort.ALPHABETICAL ? this.sortAlphabetically(results) : results;
        const paginatedResult = sortedResults.slice((page - 1) * this.PAGE_SIZE, page * this.PAGE_SIZE);
        return {
            results: paginatedResult,
            page,
            nbPages: Math.ceil(results.length / this.PAGE_SIZE),
            total: results.length,
        } as PaginatedResult<AssociationSearchEntity[]>;
    }

    public cleanCache() {
        return searchAdapter.deleteAll();
    }

    private sortAlphabetically(results: AssociationSearchEntity[]) {
        return [...results].sort((left, right) =>
            getAssociationName.execute(left).localeCompare(getAssociationName.execute(right), "fr", {
                sensitivity: "base",
            }),
        );
    }

    private buildSearchToken(value: string, location?: SearchLocation, nameOnly = false) {
        const locationValue = location && Object.values(location)[0];
        return `${value}${locationValue ? `__location:${locationValue}` : ""}${nameOnly ? "__nameOnly:true" : ""}`;
    }
}

const searchService = new SearchService(search, parseSearchLocation);

export default searchService;
