import { BadRequestError } from "core";
import associationNameService from "../association-name/associationName.service";
import searchAdapter from "../../adapters/outputs/db/search/search.adapter";
import PaginatedResult from "../../@types/PaginatedResult";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";

const POSTAL_CODE_REGEX = /^\d{2,5}$/;

export class SearchService {
    PAGE_SIZE = 12;
    CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    public async getAssociationsKeys(value: string, postalCode?: string): Promise<Partial<AssociationSearchEntity>[]> {
        const validPostalCode = this.validatePostalCode(postalCode);
        const searchToken = this.buildSearchToken(value, validPostalCode);
        const resultsFromCache = await searchAdapter.getResults(
            searchToken,
            new Date(Date.now() - this.CACHE_LIFESPAN_MS),
        );

        if (resultsFromCache) return resultsFromCache;

        // nothing in cache
        // @TODO: pagination has been removed because not used properly but we should limit the result of the find
        const entities = await associationNameService.find(value, validPostalCode);
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

    private validatePostalCode(postalCode?: string) {
        if (postalCode === undefined) return undefined;
        if (!POSTAL_CODE_REGEX.test(postalCode)) {
            throw new BadRequestError("postalCode must contain between 2 and 5 digits");
        }
        return postalCode;
    }
}

const searchService = new SearchService();

export default searchService;
