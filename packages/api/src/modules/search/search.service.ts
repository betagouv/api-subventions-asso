import { BadRequestError } from "core";
import searchAdapter from "../../adapters/outputs/db/search/search.adapter";
import PaginatedResult from "../../@types/PaginatedResult";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";
import search, { Search } from "../../usecases/search/search";
import getAssociationName from "../../usecases/search/get-association-name";

const POSTAL_CODE_REGEX = /^\d{2,5}$/;
export type SearchSort = "relevance" | "alphabetical";

export class SearchService {
    PAGE_SIZE = 20;
    CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    constructor(private search: Search) {}

    public async getAssociationsKeys(
        value: string,
        postalCode?: string,
        nameOnly = false,
    ): Promise<AssociationSearchEntity[]> {
        const validPostalCode = this.validatePostalCode(postalCode);
        const searchToken = this.buildSearchToken(value, validPostalCode, nameOnly);
        const resultsFromCache = await searchAdapter.getResults(
            searchToken,
            new Date(Date.now() - this.CACHE_LIFESPAN_MS),
        );

        if (resultsFromCache) return resultsFromCache;

        // nothing in cache
        // @TODO: pagination has been removed because not used properly but we should limit the result of the find
        const entities = await this.search.execute({ value, postalCode, nameOnly });
        searchAdapter.saveResults(searchToken, entities);

        return entities;
    }

    public async getPaginatedResult(
        value: string,
        page: number,
        postalCode?: string,
        sort: SearchSort = "relevance",
        nameOnly = false,
    ) {
        const results = await this.getAssociationsKeys(value, postalCode, nameOnly);
        const sortedResults =
            sort === "alphabetical"
                ? [...results].sort((left, right) =>
                      getAssociationName.execute(left).localeCompare(getAssociationName.execute(right), "fr", {
                          sensitivity: "base",
                      }),
                  )
                : results;
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

    private buildSearchToken(value: string, postalCode?: string, nameOnly = false) {
        return `${value}${postalCode ? `__postalCode:${postalCode}` : ""}${nameOnly ? "__nameOnly:true" : ""}`;
    }

    private validatePostalCode(postalCode?: string) {
        if (postalCode === undefined) return undefined;
        if (!POSTAL_CODE_REGEX.test(postalCode)) {
            throw new BadRequestError("postalCode must contain between 2 and 5 digits");
        }
        return postalCode;
    }
}

const searchService = new SearchService(search);

export default searchService;
