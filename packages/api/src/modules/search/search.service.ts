import { PaginatedAssociationNameDto } from "dto";
import associationNameService from "../association-name/associationName.service";
import searchPort from "../../dataProviders/db/search/search.port";
import AssociationNameDtoMapper from "./mappers/association-name-dto.mapper";

export class SearchService {
    static PAGE_SIZE = 12;
    static CACHE_LIFESPAN_MS = 24 * 60 * 60 * 1000;

    public async getAssociationsKeys(value: string, page = 1): Promise<PaginatedAssociationNameDto> {
        const resultsFromCache = await searchPort.getResults(
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
                total: resultsFromCache.total,
            };

        // nothing in cache
        const resultsEntities = await associationNameService.find(value);
        const resultsDtos = resultsEntities.map(entity => AssociationNameDtoMapper.toDto(entity));
        const nbResults = resultsDtos.length;
        searchPort.saveResults(value, resultsDtos);

        return {
            nbPages: Math.ceil(nbResults / SearchService.PAGE_SIZE),
            page,
            results: resultsDtos.slice((page - 1) * SearchService.PAGE_SIZE, page * SearchService.PAGE_SIZE),
            total: resultsDtos.length,
        };
    }

    public cleanCache() {
        return searchPort.deleteAll();
    }
}

const searchService = new SearchService();

export default searchService;
